# DAMO

###### Javascript MVC framework for 2 way data binding

Designed for front-end development  
100% JQuery based and compatible  
Light weight : less than 15ko

[Home page][0]

#### What is Damo ?

Damo is a javascript MVC framework designed for **rapid** but **clean** and **structured** front-end developpement.

#### When using Damo ?

Each time you need a two-way data binding MVC framework, to shorten your development time.

#### Why Damo ?

Damo is coming from three observations about the 2016 universe of the front-end developpement :

* AngularJS is a wonderful tool to shorten the developpement by the use of the two-way data binding. Unfortunately it is hard to learn and to use, as it requires a complete new way of thinking for the developper. Furthermore it badly cooperative when you try to integer some external libraries, even JQuery. Everything is asynchronous, even if it is useless, and that makes the Angular touchy, especially when building rich and massive applications. 
* Google also seems to think so, i.e. Angular is not achieved, and this might be why they are publishing Angular 2 ... which is not even compatible with Angular 1, and is structured absolutly differently (no scope, no ng-model, no two-way data binding, new syntax, ...). So far Google/Angular seems then to be a dead end for our business necessities that need consistency.
* JQuery is far more stable and reliable than Angular. Large and rich applications can be developped with it, but it does not provide the two-way data binding. Consequently it takes a longer time, and code, to develop with Jquery.

So, I decided to develop a library based on JQuery, keeping its simple coding fashion, but providing the two-way binding like Angular. Doing so I whish to get the stability of JQuery as well as the rapid development possibility provided by Angular. The objective is to provide a way to develop front-end applications quickly, but not dirty, with short codes and with a well structured architecture that minimize the possibility of bugs.  
  

#### Data Model

It is fundamental to note that the javascript libraries (JQuery, Angular, ...) are part of the problem for a front-end development, but the structuration of the data is an other part, which is of crucial importance. Actually **Damo** stands for **Da**ta **mo**del, which is the key element of Damo's engine. A well structured applicative data model, under a json format, reduces drastically the code to produce, when you need to manipulate the data. **This is the main idea behind Damo.**

#### Modularity

Damo's is all made of modules. Filters, directives, functions (equivalent of Angular.js's services), are all loadable from any external library, directly by inclusion inside the header of the index.html. For instance it is trivial to load and use jquery-ui if needed, or any home made processing library already coded for an other application.

#### Simplicity

Damo's is made simple to reduce the complexity of the application as much as possible. There is nos special syntax, nor module provider, nor Jqlite, ... as it is in Angular.js for instance. There are very few base functions, and very few specific html tag. Damo has been designed to be as simple as JQuery.

#### Getting started

Here is the minimum code to display "Hello World !" :
```
<!DOCTYPE html>
<html>
	<head>
		<title>Damo Hello World</title>
		<meta charset="utf-8">		
		<script src="jquery.js"></script>
		<script src="damo.js"></script>
		<script>
			damo.dm.myText = "Hello World !";
		</script>		
	</head>
	<body>
		<div damo-id="myText"></div>
	</body>
</html>
```


A more sofisticated example is provided by the damoSeed example, that you can download from the [home page][0], as well as getting the source doc and the user guide. 



---

* _"Although Damo is based on [JQuery][6], and 100% compatible, it provides the advantages of [Angular.js][7], without the boring aspects, and much simply"_

---

* Licencing : [GPL][1]
* Author : [hcl@oceanvirtuel.com][2]
  

[0]: http://www.oceanvirtuel.com/damo
[1]: http://www.gnu.org/licenses/gpl.html
[2]: mailto:hcl@oceanvirtuel.com

