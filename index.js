const dotenv = require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');

let users;
let channels;

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

// Estructuras de mensajes para enviar 
const calendar = {
	"blocks": [
    {
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "CALENDARIO ACADÉMICO 2021"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"text": "Lista de las fechas más importantes del año.",
					"type": "mrkdwn"
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":dizzy:  *PRIMER CUATRIMESTRE* :dizzy:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inicio de clases del primer cuatrimestre (2do año en adelante)*\n15 de marzo."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inicio de clases para alumnos de primer año*\n29 de marzo."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Cierre de Convocatorias para matriculación de ingresantes*\n30 de abril."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":rotating_light:  *FINALES* :rotating_light:  "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inscripción a exámenes finales*\n19 de julio al 24 de julio."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Exámenes finales*\n26 de julio al 7 de agosto."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":dizzy:  *SEGUNDO CUATRIMESTRE* :dizzy:  "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inscripciones a materias - Segundo Cuatrimestre*\n Desde el 9 a 13 de agosto."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inicio de clases - Segundo Cuatrimestre*\n 16 de agosto."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Fin de clases - Segundo Cuatrimestre*\n 27 de noviembre."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":rotating_light:  *FINALES* :rotating_light:  "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inscripción a exámenes finales - Diciembre*\n 6 al 10 de diciembre."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Exámenes finales - Diciembre*\n 11 al 23 de diciembre."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Inscripción a exámenes finales - Febrero*\n 7 al 11 de febrero."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":calendar: *Exámenes finales - Febrero*\n 14 al 25 de febrero."
			}
    },
    {
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":robot_face: Si necesitas volver a ver el calendario académico del 2021 nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/calendario` "
			}
		}
	]
}
const reglas = {
	"blocks": [
    {
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": ":newspaper:  REGLAS DE LA COMUNIDAD  :newspaper:"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Te tiramos un par de reglas para poder disfrutar el canal de la mejor manera posible:"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🍀 En este espacio buscamos valorar y potenciar el intercambio de conocimiento entre todes. "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🌷 Los debates e intercambios deben ser constructivos y de valor para la comunidad."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🍁 Evitemos cualquier falta de respeto o agresión entre nosotres. Todo se puede hablar bien y debatir tranqui."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🌻 Mantengamos los intereses propios del canal para no perder todas las cosas que vayan compartiendo. Cualquier cosa ajena al canal la pueden hablar en el canal correspondiente o por privado muchaches. Acá nos ponemos la gorra 👨‍✈️."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🍄 Ser responsables en cuanto a las cosas que subimos a los canales, que sigan buenos valores y estén alineados a la temática."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "🌼 La idea de esto es poder conocernos mejor y construir una hermosa comunidad de alumnes de Multimedia. Compartí, participá, hacete amigue. Cuantos más seamos intercambiando, más cerca estaremos de nuestro objetivo."
			}
    },
    {
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":robot_face: Si necesitas volver a ver las reglas de la comunidad nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/reglas` "
			}
		}
	]
}
const canales = {
	"blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "CANALES DE LA COMUNIDAD MULTIMEDIA"
      }
    },
    {
      "type": "context",
      "elements": [
        {
          "text": "Lista de todos los nuevos canales pensados para la comunidad multimedia :smile:.",
          "type": "mrkdwn"
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "¿Cómo va, amigue multimedial? 😌 Te voy a estar acompañanando en tu paso por el espacio de multimedia (voy a estar en todos lados y en ninguno a la vez ¡MAGIC!) para que puedas consultarme sobre recursos académicos y sobre los nuevos canales. Vine a dejarte la lista de los nuevos canales para que te puedas unir a los que más te copen:"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Lista de canales*"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":art: *Arte y Diseño:* Acá podes charlar sobre artistas, proyectos, movimientos o dudas que tengas sobre las materias de Maimo relacionadas a arte."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "arteydiseño",
        "action_id": "arteydiseño_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":movie_camera:  *Cine:* ¿Te considerás una persona cinéfila? No sos la única 😉. Sumate a este canal que otres como vos nos estaremos pasando data para pochoclear en cada rato libre 🎬. "
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "cine",
        "action_id": "cine_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":video_game: *Gaming:* Unite a este espacio para conocer juegos, armar equipetes, nerdear y viciar toda la noche en Discord."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "gaming",
        "action_id": "gaming_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":books: *Literatura:* ¿Apenas abrís un libro lo primero que hacés es olerlo? Vení, este canal es para vos 😌📖."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "literatura",
        "action_id": "literatura_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":rolling_on_the_floor_laughing: *Memes:* Vení a cagarte de risa un rato compartiendo y viendo altos memardos 😆."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "memes",
        "action_id": "memes_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":mailbox_with_mail: *Mundo laboral:* En este espacio se AGARRA LA PALA o al menos vamos a intentar ayudarte en eso 😉. Estate atento a las oportunidades laborales que puedan surgir o tips para entrevistas, currículums y portfolios."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "mundolaboral",
        "action_id": "mundolaboral_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":musical_note: *Musiquita:* Alto espacio para compartir curiosidades, producciones, novedades, preguntas o simplemente para spamear tus nuevos temitas."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "musiquita",
        "action_id": "musiquita_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "🌱 *Plantitas y naturaleza:* Valor de entrada: Un hijito de tu suculenta."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "plantitas_y_naturaleza",
        "action_id": "plantitas_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":hatched_chick: *Procrastinación y animalitos:* En este grupo creemos que no hay nada más lindo que ver animalitos y evitar hacer ese TP que tanto te embola 🐶💚🐱."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "procrastinacionyanimalitos",
        "action_id": "procrastinacionyanimalitos_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":computer: *Programación:* Vení a compartir en este espacio tus curiosidades, inquietudes, soluciones, proyectos y frustraciones en este bello y apocalíptico mundo de la programación 🥳 🤩."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "programacion",
        "action_id": "programacion_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":knife_fork_plate: *Recetas:* Aprovecha este espacio para compartir tu mejor receta de masa madre 🌚  (o lo que más te guste cocinar) y comentar de lugares piolitas (y con protocolo 🚨 ) para tomar un birrita 🍻."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "recetas",
        "action_id": "recetas_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":couch_and_lamp: *Sillón del psicólogo:* ¿Tuviste un mal día? ¿querés hablar de algo que te tiene para atrás? ¿necesitas desahogarte? Acá estamos todes en una, capaz este espacio te pueda ayudar ♥ ."
      },
      "accessory": {
        "type": "button",
        "text": {
          "type": "plain_text",
          "text": "Unirse"
        },
        "style": "primary",
        "value": "sillondelpsicologo",
        "action_id": "sillondelpsicologo_button"
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": ":robot_face: Si necesitas volver a ver la lista de canales nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/canales` "
      }
    }
  ]
}
const certificadoRegular = {
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "CERTIFICADO DE ALUMNO REGULAR"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"text": "Instrucciones para descargar el certificado de alumno regular desde el campus de la universidad.",
					"type": "mrkdwn"
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Descargar certificado*"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":one: Ingresá al <http://www.maimonidesvirtual.com.ar/|campus de la universidad> e inicia sesión."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":two: Hace click en el item de *Certificados* en el menú del campus."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":three: En la página de Certificados hace click en la opción de *certificado de alumno regular* y completá el nombre del destinatario del certificado en el pop-up."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":four: Después de ingresar el destinatario, hace click en aceptar para descargar el certificado de alumno regular como archivo PDF."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":robot_face: Si necesitas volver a ver cómo descargar el certificado de alumno regular nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/certificado` "
			}
		}
	]
}
const situacionAcademica = {
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "SITUACIÓN ACADÉMICA"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"text": "Instrucciones para descargar tu situación académica desde el campus de la universidad.",
					"type": "mrkdwn"
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Descargar situación académica*"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":one: Ingresá al <http://www.maimonidesvirtual.com.ar/|campus de la universidad> e inicia sesión."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":two: Hace click en el item de *Secretaria Académica* en el menú del campus."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":three: En la página de Secretaria Académica hace click en la opción de *Situación Académica*."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":four: Hace click en *Descargar Situación Académica* para obtener el historial como archivo PDF."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":robot_face: Si necesitas volver a ver cómo descargar tu situación académica nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/situacionacademica` "
			}
		}
	]
}
const comandos = {
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "COMANDOS DE MULTINEITOR"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"text": "Lista de todos los comandos disponibles para interactuar conmigo :smile:.",
					"type": "mrkdwn"
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Mis comandos*"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":one: *Situación Académica:* Si querés conocer cómo vas con las materias de la facu podés llamarme escribiendo `/situacionacademica`."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":two: *Certificado de alumno regular:* Si querés saber cómo descargar tu certificado de alumno regular podés llamarme escribiendo `/certificado`."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":three: *Canales para la comunidad:* Si tenés ganas de unirte a algunos de los canales de la comunidad de Multimedia y no te acordas cuáles eran podés llamarme escribiendo `/canales`."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":four: *Reglas de la comunidad:* Tenemos una serie de reglas para todos los canales del espacio de Multimedia para que todes estemos a gusto. Si te interesa conocerlas podés llamarme escribiendo `/reglas`."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":five: *Calendario académico:* Podés estar al tanto de todo lo que va a pasar durante el ciclo lectivo de este año escribiendo `/calendario`."
			}
    },
    {
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":six: *Bots:* Si te da curiosidad conocer las funciones de los bots que están instalados en el espacio de Multimedia, podés consultarlas escribiendo `/bots`."
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":robot_face: Si necesitas volver a ver la lista de mis comandos nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/comandos` "
			}
		}
	]
}
const bots = {
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": ":robot_face: BOTS DEL ESPACIO MULTIMEDIA"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"text": "Lista de todos los bots disponibles en el espacio Multimedia.",
					"type": "mrkdwn"
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A01EWGG903F-bored|Polly>:* bot para armar encuestas, entrevistas y trivias. Te lo recomiendo también para pedir feedback."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://reverlux-space.slack.com/apps/A0F827J2C-giphy|Giphy>:* bot que permite buscar rapidamente gifs en la base de Giphy para enviar como mensaje directo."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A6WH0KSPQ-lasso|Lasso>:* guarda los links que son enviados en los canales para que no se pierdan."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A8NB3C538-music-digest|Music Digest>:* crea playlists con las canciones que son enviadas en el canal.."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A0QAZV90X-birthdaybot|Birthday Bot>:* consulta a todes les usuaries cuando es su cumpleaños, para así, en ese día, enviar un mensaje con saludo por el canal general para que toda la comunidad pueda saludar a quien cumple años."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A3PEYBNK1-callie|Callie>:* Callie ofrece una cuenta regresiva divertida para eventos futuros. Puede ser utilizado para cualquier calendario que se comunique por Slack."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A740FQ2E7-eventbot-calendar|Eventbot Calendar>:* crear y visualizar calendarios compartidos dentro de un canal."
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<https://carrerademultimedia.slack.com/apps/A01EWGG903F-bored|Bored>:* ofrece minijuegos de máximo 2 minutos entre usuarios de un canal. "
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":robot_face: Si necesitas volver a ver la lista de bots nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/bots` "
			}
		}
	]
}

const memes = ["./public/meme1.jpg", "./public/meme2.jpg", "./public/meme3.jpg", "./public/meme4.jpg", "./public/meme5.jpg", "./public/meme6.jpg"];

// Archivos
const calendarioAcademico = "./public/calendario.pdf";

// Recopila todos los canales y usuarios para usar más adelante en la función de enviar los canales a los todos los usuarios
(async () => {
  const result = await app.client.users.list({
    token: process.env.SLACK_BOT_TOKEN,
  });
  const channelsResult = await app.client.conversations.list({
    token: process.env.SLACK_BOT_TOKEN,
  });
  users = result.members;
  channels = channelsResult.channels;
  sendChannels();
})();

// Enviar canales cuando alguien se une al espacio de Multimedia
app.event('team_join', async ({ event, client }) => {
  sendMessage(event.user.id);
});

//// ***** COMANDOS ***** ////

app.command('/reglas', async ({ command, ack, say }) => {
  console.log(command);
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(reglas);
});

app.command('/canales', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(canales);
});

app.command('/calendario', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(calendar);
  console.log(command)
  const result = await app.client.files.upload({
    token: process.env.SLACK_BOT_TOKEN,
    channels: command.channel_id,
    initial_comment: "Acá te dejo el PDF con toda la información del Calendario Académico del Ciclo Lectivo 2021 :smile:",
    file: fs.createReadStream(calendarioAcademico)
  });
});

app.command('/certificado', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(certificadoRegular);
});

app.command('/comandos', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(comandos);
});

app.command('/situacionacademica', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(situacionAcademica);
});

app.command('/bots', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  await say(bots);
});

app.command('/memes', async ({ command, ack, say }) => {
  await ack();
  await say(`A sus ordenes, <@${command.user_id}> :zap:`);
  const memeToSend = selectMeme();
  const result = await app.client.files.upload({
    token: process.env.SLACK_BOT_TOKEN,
    channels: command.channel_id,
    initial_comment: "Lo pedis, lo tenés",
    file: fs.createReadStream(memeToSend)
  });
});

////////////////////////////////////////////////////////

// Enviar mensajes a todos los usuarios con los canales

const sendChannels = () =>{
  users.forEach(user => {
    console.log(user.id)
    //sendMessage(user.id)
  })
}

const sendMessage = async (user) =>{
  const result = await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: user,
    text: '¡Nuevos canales disponibles en el espacio Maimo!',
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "CANALES DE LA COMUNIDAD MULTIMEDIA"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "text": "Lista de todos los nuevos canales pensados para la comunidad multimedia :smile:.",
            "type": "mrkdwn"
          }
        ]
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "¿Cómo va, amigue multimedial? 😌 Te voy a estar acompañanando en tu paso por el espacio de multimedia (voy a estar en todos lados y en ninguno a la vez ¡MAGIC!) para que puedas consultarme sobre recursos académicos y sobre los nuevos canales. Vine a dejarte la lista de los nuevos canales para que te puedas unir a los que más te copen:"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Lista de canales*"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":art: *Arte y Diseño:* Acá podes charlar sobre artistas, proyectos, movimientos o dudas que tengas sobre las materias de Maimo relacionadas a arte."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "arteydiseño",
          "action_id": "arteydiseño_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":movie_camera:  *Cine:* ¿Te considerás una persona cinéfila? No sos la única 😉. Sumate a este canal que otres como vos nos estaremos pasando data para pochoclear en cada rato libre 🎬. "
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "cine",
          "action_id": "cine_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":video_game: *Gaming:* Unite a este espacio para conocer juegos, armar equipetes, nerdear y viciar toda la noche en Discord."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "gaming",
          "action_id": "gaming_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":books: *Literatura:* ¿Apenas abrís un libro lo primero que hacés es olerlo? Vení, este canal es para vos 😌📖."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "literatura",
          "action_id": "literatura_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":rolling_on_the_floor_laughing: *Memes:* Vení a cagarte de risa un rato compartiendo y viendo altos memardos 😆."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "memes",
          "action_id": "memes_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":mailbox_with_mail: *Mundo laboral:* En este espacio se AGARRA LA PALA o al menos vamos a intentar ayudarte en eso 😉. Estate atento a las oportunidades laborales que puedan surgir o tips para entrevistas, currículums y portfolios."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "mundolaboral",
          "action_id": "mundolaboral_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":musical_note: *Musiquita:* Alto espacio para compartir curiosidades, producciones, novedades, preguntas o simplemente para spamear tus nuevos temitas."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "musiquita",
          "action_id": "musiquita_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🌱 *Plantitas y naturaleza:* Valor de entrada: Un hijito de tu suculenta."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "plantitas_y_naturaleza",
          "action_id": "plantitas_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":hatched_chick: *Procrastinación y animalitos:* En este grupo creemos que no hay nada más lindo que ver animalitos y evitar hacer ese TP que tanto te embola 🐶💚🐱."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "procrastinacionyanimalitos",
          "action_id": "procrastinacionyanimalitos_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":computer: *Programación:* Vení a compartir en este espacio tus curiosidades, inquietudes, soluciones, proyectos y frustraciones en este bello y apocalíptico mundo de la programación 🥳 🤩."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "programacion",
          "action_id": "programacion_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":knife_fork_plate: *Recetas:* Aprovecha este espacio para compartir tu mejor receta de masa madre 🌚  (o lo que más te guste cocinar) y comentar de lugares piolitas (y con protocolo 🚨 ) para tomar un birrita 🍻."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "recetas",
          "action_id": "recetas_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":couch_and_lamp: *Sillón del psicólogo:* ¿Tuviste un mal día? ¿querés hablar de algo que te tiene para atrás? ¿necesitas desahogarte? Acá estamos todes en una, capaz este espacio te pueda ayudar ♥ ."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Unirse"
          },
          "style": "primary",
          "value": "sillondelpsicologo",
          "action_id": "sillondelpsicologo_button"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":robot_face: Si necesitas volver a ver la lista de canales nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/canales` "
        }
      }
    ]
  });
}

//// ***** LISTENERS DE ACCIONES PARA LOS BOTONES ***** ////

app.action("arteydiseño_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Arte y diseño :art:`);
  inviteToChannel(user, value);
});

app.action("recetas_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Recetas :cookie:`);
  inviteToChannel(user, value);
});

app.action("programacion_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Programación :technologist:`);
  inviteToChannel(user, value);
});

app.action("memes_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Memes :laughing:`);
  inviteToChannel(user, value);
});

app.action("cine_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Cine`);
  inviteToChannel(user, value);
});

app.action("gaming_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Gaming`);
  inviteToChannel(user, value);
});

app.action("literatura_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Literatura`);
  inviteToChannel(user, value);
});

app.action("musiquita_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Musiquita`);
  inviteToChannel(user, value);
});

app.action("oportunidadeslaborales_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Oportunidades Laborales`);
  inviteToChannel(user, value);
});

app.action("procrastinacionyanimalitos_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Oportunidades Laborales`);
  inviteToChannel(user, value);
});

app.action("sillondelpsicologo_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de Sillón del Psicólogo`);
  inviteToChannel(user, value);
});

app.action("vr-ar-rx_button", async ({ ack, say, body, action}) => {
  await ack();
  let value = action.value;
  let user = body.user.id;
  await say(`Todo listo, ya te sume al canal de VR-AR-RX`);
  inviteToChannel(user, value);
});

/////////////////////////////////////////////////

// Agregar usuario a canal
const inviteToChannel = async (user, value) =>{
  let channel = findChannel(value);
  const result = await app.client.conversations.invite({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channel,
    users: user,
  });
  const ephemeralMessage = await app.client.chat.postEphemeral({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channel,
    user: user,
    text: "¡Que bueno que te hayas unido al canal! :tada: Paso a dejarte las reglas de la comunidad para que estés al tanto de todo lo que se puede y no se puede hacer en el canal.",
    blocks: [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": ":newspaper:  REGLAS DE LA COMUNIDAD  :newspaper:"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Te tiramos un par de reglas para poder disfrutar el canal de la mejor manera posible:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🍀 En este espacio buscamos valorar y potenciar el intercambio de conocimiento entre todes. "
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🌷 Los debates e intercambios deben ser constructivos y de valor para la comunidad."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🍁 Evitemos cualquier falta de respeto o agresión entre nosotres. Todo se puede hablar bien y debatir tranqui."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🌻 Mantengamos los intereses propios del canal para no perder todas las cosas que vayan compartiendo. Cualquier cosa ajena al canal la pueden hablar en el canal correspondiente o por privado muchaches. Acá nos ponemos la gorra 👨‍✈️."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🍄 Ser responsables en cuanto a las cosas que subimos a los canales, que sigan buenos valores y estén alineados a la temática."
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "🌼 La idea de esto es poder conocernos mejor y construir una hermosa comunidad de alumnes de Multimedia. Compartí, participá, hacete amigue. Cuantos más seamos intercambiando, más cerca estaremos de nuestro objetivo."
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": ":robot_face: Si necesitas volver a ver las reglas de la comunidad nuevamente, acordate que podés consultarme escribiendo :arrow_right:  `/reglas` "
        }
      }
    ]
  });
}

// Busca y retorna el ID de un canal según el canal que se pase como parametro
const findChannel = (channelName) =>{
  const channel = channels.find(channel =>{
    if(channelName === channel.name){
      return channel
    }
  })
  return channel.id
}

const selectMeme = () =>{
    let selectMeme = memes[random(0, 5)];
    return selectMeme
}

const random = (min, max) =>{
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// Encender server
(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();



