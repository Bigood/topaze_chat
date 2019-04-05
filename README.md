# Modèle Topaze Chat (code GEVPITopaze)
Modèle topaze avec des bulles de commentaires, à la manière d'une application de discussion instantanée. 

Voir [un exemple de réalisation](https://ledroitdesavoir.imt-atlantique.fr/savoir-etre-net/) (voir Etude de cas), et [le wiki pour la documentation technique](https://github.com/Bigood/topaze_chat/wiki/)

Topaze Scenari 4.1 - v1.4.017
SVN : Sources trouvées pour v1.4.017 - dernière mise à jour début 2016

Crédits : Maen Juganaikloo

---

# Utiliser les bulles de discussion

![Exemple de représentation, côté utilisateur](https://d2mxuefqeaa7sj.cloudfront.net/s_9F2A21C19D1EEE72ACAB04E0DF405517507EB8DFDE324E89A32EE798E417B1F1_1541777444959_image.png)


Il s’agit d’items correspondants à des personnages, dont le prénom et l’image affichés dépendent d’une variable Topaze (calculée ou non). 

L’objectif est de pouvoir représenter au mieux des dialogues entre personnages, comme une conversation chat, avec des bulles et avatars.

Par exemple, imaginons 5 types de personnages : *moi*, une informaticienne, un documentaliste, une chef de projet, une designer et une juriste.
En fonction du parcours choisi (et donc des variables), l’informaticienne pourrait s’appeler Léa, Marie ou Jeanne.


----------
# Prérequis 
## Disposer de ScenariChain Client 4.1
- [Téléchargez le logiciel correspondant à votre plateforme](https://download.scenari.software/SCENARIchain-client@4.1.0.11/) 
- Suivez le [tutoriel fait par Kelis sur l’installation de ScenariChain 4.1](https://docs.kelis.fr/sc41/adminChain/co/installScChain.html)
## Installer le modèle documentaire TopazeGEVPI
- Téléchargez la dernière version du modèle documentaire
- Suivez le [tutoriel fait par Kelis sur l’installation d’un modèle documentaire](https://docs.kelis.fr/sc41/adminChain/co/installModDocLocal.html)

*Si vous utilisez ScenariServer, assurez vous de la version utilisée et procédez à l’installation du modèle sur le serveur.*

----------
**# Tutoriel
## 1. Créez les variables calculées de parcours
![Exemple d’architecture pour les variables calculées](https://trello-attachments.s3.amazonaws.com/59edd18066725bbe906b228c/5be468bc8f9fed394a6ef907/ce0a4d1df04d0e84f0ee12a69833097a/image.png)


Pour afficher des prénoms / images en fonction de noeuds visités (ou par rapport à d’autres conditions), nous devons utiliser des variables calculées via Javascript. Si le prénom que vous voulez afficher est une variable utilisateur, vous n’avez pas besoin de créer une variable calculée).

Par soucis d’organisation, créez tout d’abord un dossier qui va contenir vos variables, avec deux sous-dossiers : *images* et *prenoms.*

Ensuite, créez un indicateur calculé par type de personnage que vous souhaitez utiliser dans votre ressource.

Dans l’exemple ci-dessus, nous avons 6 personnages (dont l’utilisateur, appelé *joueur, qui ne possède pas de variable calculé de prénom*).

**Les variables de prénoms**

![](https://d2mxuefqeaa7sj.cloudfront.net/s_9F2A21C19D1EEE72ACAB04E0DF405517507EB8DFDE324E89A32EE798E417B1F1_1541778902523_image.png)


Vous pouvez utiliser vos conditions habituelles dans vos **if** : une condition de passage à un noeud (comme dans l’exemple ci-contre), la valeur d’un indicateur…

Vous devez renvoyer une chaine de caractère (entourée de guillemets) avec le mot clé **return**.

**Les variables d’images**

Comme pour les prénoms, vous pouvez utiliser vos conditions habituelles dans vos **if.**

Vous devez renvoyer une chaine de caractère (entourée de guillemets) avec le mot clé **return** suivant ce format :


    <div class="personnage_ti_avatar" style="background-image:url(_URL_);"></div>

Dans cette ligne précédente, vous ne devez changer que *_URL_* par l’adresse de votre image. 
Le reste doit obligatoirement rester comme cela au minimum (vous pouvez ajouter des classes, ID ou autre si vous voulez).

![Exemple de variable calculée, avec des adresses relatives](https://d2mxuefqeaa7sj.cloudfront.net/s_9F2A21C19D1EEE72ACAB04E0DF405517507EB8DFDE324E89A32EE798E417B1F1_1541779111482_image.png)


Vous pouvez utiliser des adresses absolues, comme par exemple “*https://placecage.com/50/50”*, ou des adresses relatives, comme “*../res/image.png”*. 

Pour les adresses relatives, vous devez avoir utilisé l’image au préalable quelque part dans votre ressource Scenari (sinon, elle n’est pas exportée dans le dossier *../res*). Vous devez ensuite utiliser le nom de votre image, en remplaçant tout espace et tout caractère spécial par des tirets bas “_”, et toute lettre accentuée par son équivalent sans accent.

## 2. Créez des bulles de dialogue

Les discussions sont un type de balises à part entière, au même titre que les balises pédagogiques. Vous ne pouvez pas les mélanger.

![Transformation du type de contenu](https://trello-attachments.s3.amazonaws.com/59edd18066725bbe906b228c/5be468bc8f9fed394a6ef907/fe9f7a781b79fb9beb6d9ebf9a3621b7/image.png)


Vous devez donc :

- Soit changer le type d'item utilisé dans l'étape,
- Soit créer une partie / sous partie de votre contenu (en utilisant l’astérisque sur la même ligne que le point d’interrogation).

Ensuite, vous pouvez créer deux types de bulles de dialogues : 

- Gauche : alignée à gauche, de couleur verte. Privilégiée pour faire parler les personnages.
- Droite : alignée à droite, de couleur bleue. Privilégiée pour faire parler le joueur.

Vous devez ensuite utiliser les variables déclarées précédemment pour remplir les champs *Prénom* et *Image*, comme sur l’image suivante.

![Vous pouvez utiliser n’importe quel type de contenu dans ces bulles, comme dans les balises pédagogiques](https://d2mxuefqeaa7sj.cloudfront.net/s_9F2A21C19D1EEE72ACAB04E0DF405517507EB8DFDE324E89A32EE798E417B1F1_1541780661767_image.png)


A noter, vous pouvez rajouter du texte en plus de la variable pour le champ *Prénom.*
