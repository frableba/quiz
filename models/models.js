var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
         {dialect: dialect,
          protocol: protocol,
          port: port,
          host: host,
          storage: storage,   // solo SQLite (.env)
          omitNull: true      // solo Postgres
        }
      );

//Importar la definicion de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar la definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment, {
'constraints': true,
'onUpdate': 'cascade',
'onDelete': 'cascade',
'hooks': true
});

exports.Quiz = Quiz; //exportar definición de tabla Quiz
exports.Comment = Comment;

//sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
  //then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count){
    if (count===0) {   //la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'otro'
                  });
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'otro'
                  });
      Quiz.create({ pregunta: '¿Cuál es el planeta más grande de nuestro sistema solar?',
                    respuesta: 'Júpiter',
                    tema: 'ciencia'
                  });
      Quiz.create({ pregunta: 'En "Alicia en el país de las Maravillas", ¿de qué color estaban pintando los jardineros las rosas?',
                    respuesta: 'Rojo',
                    tema: 'humanidades'
                  });
      Quiz.create({ pregunta: '¿En qué año se grabó la serie "Verano Azul"?',
                    respuesta: '1978',
                    tema: 'ocio'
                  })

      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
