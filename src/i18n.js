import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {string} from "yup";

i18n
    .use(LanguageDetector)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: {
                         "Home Welcome to InfoFauna": "Welcome to InfoFauna",
                         "Home Login": "Login",

                        "Person Persons":"Persons",
                        "Person Persons management":"Persons management" ,
                        "Person Person management, add, edit and delete":"Person management, add, edit and delete",
                        "Person Personal information":"Personal information",
                        "Person Address":"Address",
                        "Person Add new person":"Add new person",
                        "Person Filter by first or last name":"Filter by first/last name",

                        "Person Academic title":"Academic title",
                        "Person Lastname":"Lastname",
                        "Person Firstname":"Firstname",
                        "Person Street and number":"Street and number",
                        "Person Additional information":"Additional information",
                        "Person Postal code":"Postal code",
                        "Person City":"City",
                        "Person Country":"Country",
                        "Person Gender":"Gender",
                        "Person Language":"Language",
                        "Person Date of birth":"Date of birth",
                        "Person Contact informations":"Contact informations",
                        "Person Professional phone":"Professional phone",
                        "Person Private phone":"Private phone",
                        "Person Mobile phone":"Mobile phone",
                        "Person E-mail":"E-mail",
                        "Person Save":"Save",
                        "Person Delete":"Delete",

                        "Person Loading Person":"Loading person data ...",
                        "Person Person Detail":"Person detail",

                        "Person FirstName is required":"FirstName is required",
                        "Person LastName is required":"LastName is required",
                        "Person Gender is required":"Gender is required",
                        "Person Language is required":"Language is required",
                        "Person Country is required":"country is required",
                        "Person Phone format is not valid":"Phone format is not valid",
                        "Person Email format is not valid":"Email format is not valid",

                        "Project Project":"Project",
                        "Project Projects":"Projects",
                        "Project Projects management":"Projects management" ,
                        "Project Management, add, edit and delete":"Project management, add, edit and delete",

                        "Project Information":"project information",
                        "Project Institution":"Institution",
                        "Project Add new project":"Add new project",
                        "Project Filter by code or name":"Filter by code/name",
                        "Project Filter by institution":"Filter by institution",
                        "Project Parent project":"Parent Project",
                        "Project Parent project search":"Search Parent Project",

                        "Project Code IFF":"Code IFF",
                        "Project Code CH":"Project CH-Code",
                        "Project Name":"Project name",
                        "Project Ref":"Project Ref.",
                        "Project Principal":"Project principale",
                        "Project Echance blocking":"Project echance blocking",
                        "Project URL":"Project URL",
                        "Project Type":"Project type",
                        "Project Origin funding":"Origin of project funding",
                        "Project Access limits":"Data access limits",

                        "Project Date strat":"Start",
                        "Project Date end":"End",
                        "Project Date day":"Day",
                        "Project Date month":"Month",
                        "Project Date year":"Year",

                        "Project Description":"Project description",

                        "Project Mandating institution":"Mandating Institution",
                        "Project Mandating institution name":"Name",
                        "Project Mandating institution name search":"Search Mandating Institution",
                        "Project Mandating institution person":"Person in charge",
                        "Project Mandating institution person search":"Search Person",
                        "Project Mandating institution name manuel":"Name at the time of project launch",
                        "Project Mandating institution firstName manuel":"Person's name  at the time of project launch" ,
                        "Project Mandating institution lastName manuel":"Person's given name at the time of project launch" ,


                        "Project Mandatory institution":"Mandatory Institution",
                        "Project Mandatory institution name":"Name",
                        "Project Mandatory institution name search":"Search Mandatory Institution",
                        "Project Mandatory institution person":"Person in charge",
                         "Project Mandatory institution person search":"Search Person",
                        "Project Mandatory institution name manuel":"Name at the time of project launch",
                        "Project Mandatory institution firstName manuel":"Person's name  at the time of project launch" ,
                        "Project Mandatory institution lastName manuel":"Person's given name at the time of project launch" ,



                        "AUTOCOMPLET No results found":"No results found",
                        "Form Enable edit mode":"Enable edit mode",
                        "Table Previous":"Previous",
                        "Table Next":"Next",
                        "Table Loading":"Loading...",
                        "Table No rows found":"No rows found",
                        "Table Page":"Page",
                        "Table Of":"of ",
                        "Table Rows":"rows ",

                        "Audit Data creation and modification history":"Data creation and modification history",
                        "Audit Date and hour":"Date and hour",
                        "Audit User":"User",
                        "Audit ORACLE Database users":"ORACLE Database users",
                        "Audit Creation":"Creation",
                        "Audit Last Update":"Last Update",
                        "Audit Web application users":"Web application users",

                }
            },
            fr: {
                translations: {
                    "Home Welcome to InfoFauna": "Bienvenue dans InfoFauna",
                    "Home Login": "Login",

                    "Person Persons":"Personnes",
                    "Person Persons management":"Gestion des personnes" ,
                    "Person Person management, add, edit and delete":"Gestion des personnes, ajouter, modifier et supprimer",
                    "Person Personal information":"Information personnelle",
                    "Person Address":"Adresse",
                    "Person Add new person":"Ajouter une nouvelle personne",
                    "Person Filter by first or last name":"Filtrer par nom ou prénom",

                    "Person Academic title":"Titre académique",
                    "Person Lastname":"Nom",
                    "Person Firstname":"Prénom",
                    "Person Street and number":"Rue et numéro",
                    "Person Additional information":"Complément",
                    "Person Postal code":"Code postal",
                    "Person City":"Localité",
                    "Person Country":"Pays",
                    "Person Gender":"Genre",
                    "Person Language":"Langue",
                    "Person Date of birth":"Date de naissance",
                    "Person Contact informations":"Information de contact",
                    "Person Professional phone":"Téléphone professionnel",
                    "Person Private phone":"Téléphone privé",
                    "Person Mobile phone":"Téléphone mobile",
                    "Person E-mail":"E-mail",
                    "Person Save":"Sauvgarder",
                    "Person Delete":"Supprimer",

                    "Person Loading Person":"Chargement...",
                    "Person Person Detail":"Détail de la personne",
                    "Person FirstName is required":"Le prénom est requis",
                    "Person LastName is required":"Le nom est requis",
                    "Person Gender is required":"Le genre est requis",
                    "Person Language is required":"la langue est requise",
                    "Person Country is required":"pays est requis",
                    "Person Phone format is not valid":"Le format du téléphone n'est pas valide",
                    "Person Email format is not valid":"Le format d'E-Mail n'est pas valide",

                    "AUTOCOMPLET No results found":"Aucun résultat trouvé",
                    "Form Enable edit mode":"Activer le mode d'édition",
                    "Table Previous":"Précédent",
                    "Table Next":"Suivant",
                    "Table Loading":"Chargement ...",
                    "Table No rows found":"Aucune ligne trouvée",
                    "Table Page":"Page",
                    "Table Of":"sur",
                    "Table Rows":" ",

                    "Audit Data creation and modification history":"Historique de la saisie et des modifications des données",
                    "Audit Date and hour":"Date et heure",
                    "Audit User":"User",
                    "Audit ORACLE Database users":"Utilisateurs de la base de données ORACLE",
                    "Audit Creation":"Création",
                    "Audit Last Update":"Dernière modification",
                    "Audit Web application users":"Utilisateurs du système d’information",



                }
            },
            it: {
                translations: {

                }
            }
        },
        fallbackLng: 'en',
        debug: true,

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ','
        },

        react: {
            wait: true
        }
    });

export default i18n;