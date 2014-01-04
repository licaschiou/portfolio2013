var myVars={
	p5FontSize: 18,
	nodeCount: 0,
	springCount: 0,
	shadowDisplacement: 3,
	selectedFilter: "all"
};

$(document).ready(function(){
	myVars.$p5Canvas=$('#p5Canvas').get(0);
	if(myVars.$p5Canvas!=undefined){
		myVars.canvasWidth=$("#p5Parent").width();
		myVars.canvasHeight=$( window ).height() * 0.9;
		myVars.screenSizeRatio=myVars.canvasWidth/960;
		
		if(myVars.canvasWidth > 960)myVars.p5FontSize=20;
		else if(myVars.canvasWidth > 640 && myVars.canvasWidth < 960)myVars.p5FontSize=16;
		else if(myVars.canvasWidth < 640 )myVars.p5FontSize=12;

		myVars.p5Engine=new Processing(myVars.$p5Canvas,mySketch);

		$('#p5Canvas').mouseleave(function(event){
			myVars.mouseOutOfCanvas = 1;
		});
		$('#p5Canvas').mouseenter(function(event){
			myVars.mouseOutOfCanvas = 0;
		});
	}

	$('#workFilter h1').each(function(){
		$(this).mouseenter(function(){
			$(this).css('cursor','pointer').css('color','#4f4f48');
		});
		$(this).mouseleave(function(){
			if( $(this).html() != myVars.selectedFilter)$(this).css('color','#bdc0ba');	
		});
		$(this).click(function(){
			myVars.selectedFilter = $(this).html();
			if(myVars.selectedFilter == "all"){
				$("#workListContainer a[class]").each(function(){
					$(this).css('display','inline');
				});
			}else{
				$("#workListContainer a[class]").each(function(){
					if($(this).attr("class") != myVars.selectedFilter){
						$(this).css('display','none');
					}else{
						$(this).css('display','inline');
					}
				});
			}
			$('#workFilter h1').each(function(){
				$(this).css('color','#bdc0ba');	
			});
			$(this).css('color','#4f4f48');
		});
	});

	$("a[class='IxD']").each(function(){
		console.log($(this).text());
	});

});

$(window).resize(function() {
	myVars.$p5Canvas=$('#p5Canvas').get(0);
	myVars.canvasWidth=$("#p5Parent").width();
	myVars.canvasHeight=$( window ).height() * 0.9;
	myVars.screenSizeRatio=myVars.canvasWidth/960;
	myVars.p5Engine.resize();

	//myVars.p5Engine.stopDrawing();
	//myVars.p5Engine=null;
	//myVars.p5Engine = new Processing(myVars.$p5Canvas, mySketch);
});

function showMyName(){
	$('*').each(function(){
		var current=this;
		this.onclick=function(event){
			if(!event) event=window.event;
			var target=(event.target)?event.target:event.srcElement;
		}
	});	
}

function mySketch(processing){
	var p5=processing;
	var numNodes=20;
	var seletecNodeId=-1;
	var nodeArray=new Array();
	var springArray=new Array();
	var readmePieAngle=0;

	p5.setup=function(){
		p5.size(myVars.canvasWidth, myVars.canvasHeight);		
		p5.background(252,250,242,0);
		p5.frameRate(30);
		p5.smooth();
		p5.fill(0);
		p5.stroke(0);
		
		myVars.p5Font=p5.createFont('Oxygen', myVars.p5FontSize, true);
		p5.textSize(myVars.p5FontSize);
		p5.textFont(myVars.p5Font);

		initializeGraphic();
	}

	p5.draw=function(){
		p5.background(252,250,242,0);
		createReadme();

		if(myVars.mouseOutOfCanvas > 0){
			if(seletecNodeId>-1){
				nodeArray[seletecNodeId].setSelected(0);
				nodeArray[seletecNodeId].setShowSkill(0);
				nodeArray[seletecNodeId].shrink();
			}		
			seletecNodeId=-1;
		}

		if(seletecNodeId>-1){
			nodeArray[seletecNodeId].location.x=p5.mouseX;
			nodeArray[seletecNodeId].location.y=p5.mouseY;
		}

		for(var i=0; i<springArray.length; i++){
			springArray[i].update();
			springArray[i].render();			
		}
		p5.noStroke();
		
		for(i=0; i<nodeArray.length; i++){
			if(i!=seletecNodeId){
				nodeArray[i].attractArray(nodeArray);
				nodeArray[i].update();
				nodeArray[i].render();
				nodeArray[i].renderText();
			}			
		}

		if(seletecNodeId>-1){
			nodeArray[seletecNodeId].render();	
			nodeArray[seletecNodeId].renderText();		
		}
	
	}

	p5.mousePressed=function(){
		var mouseLoc=new p5.PVector(p5.mouseX, p5.mouseY);
		console.log(mouseLoc);
		for(var i=0; i<nodeArray.length; i++){
			var distToCurosr=p5.PVector.sub(nodeArray[i].location, mouseLoc);
			if(distToCurosr.mag()<10){
				//TODO: onPress : Show skill level/ experience effect
				seletecNodeId=i;				
				nodeArray[seletecNodeId].setSelected(1);
				nodeArray[seletecNodeId].pieChartAngle=0;
				nodeArray[seletecNodeId].setShowSkill(1);
				nodeArray[seletecNodeId].enlarge();
				break;
			}
		}	
	}

	p5.mouseReleased=function(){
		if(seletecNodeId>-1){
			nodeArray[seletecNodeId].setSelected(0);
			nodeArray[seletecNodeId].setShowSkill(0);
			nodeArray[seletecNodeId].shrink();
		}		
		seletecNodeId=-1;
	}

	p5.resize=function(){		
		p5.size(myVars.canvasWidth, myVars.canvasHeight);
		//resize node.
	}

	p5.stopDrawing=function(){
		/* Stop all the drawing before reset pjs.*/
		p5.background(252,250,242,0);
		this.draw=function(){}
	}

	var createReadme=function(){
		var readmePieRadius=24;
		var pieX=p5.width / 2;
		var pieY=40;
		p5.fill(79,79,72);
		p5.ellipse(pieX,pieY,30,30);
		p5.fill(252,250,242);
		p5.ellipse(pieX,pieY,24,24);
		p5.fill(189,192,186);		
		createReadmePie(pieX, pieY);
		// p5.fill(252,250,242);
		// p5.ellipse(pieX,pieY,16,16);
		p5.fill(79,79,72);
		//p5.fill(145,152,159);		
		p5.text("Click / Drag",pieX+26, pieY+6);
		//var sectionFontSize=p5.max(36 * myVars.screenSizeRatio, 18);
		//p5.textSize(sectionFontSize);
		var textWidth=p5.textWidth("My Skill Set");
		p5.text("My Skill Set",pieX - textWidth - 26, pieY+6);
		p5.textSize(myVars.p5FontSize);
	}

	var createReadmePie=function(initX, initY){
		var pieRadius=12;
		var radTarget=720;
		var radPieChart=p5.radians(readmePieAngle);
		p5.beginShape();
		p5.vertex(initX,initY);
		for(var i=0; i<radPieChart; i+=0.01){
			var rotateAngle=i-p5.PI/2;
			p5.vertex(initX + pieRadius*p5.cos(rotateAngle),initY + pieRadius*p5.sin(rotateAngle));
		}
		p5.vertex(initX,initY);
		p5.endShape(p5.CLOSE);
		if(readmePieAngle<radTarget)readmePieAngle+=2;
		if(readmePieAngle>=radTarget)readmePieAngle=0;
	}

	var initializeSprings=function(){
		var i=0;
		createSpringArrayItem(i,"Graphic");
	}

	var createNodeArrayItem=function(index, size, color, name){
		nodeArray[index]=new p5Node(p5);
		nodeArray[index].setRadius(size);
		nodeArray[index].setColor(color);
		nodeArray[index].setName(name);		
		nodeArray[index].setLocation(p5.width/2+p5.random(-100,100), p5.height/2+p5.random(-100,100));
		myVars.nodeCount++;
	}

	var createSpringArrayItem=function(index, length, n1, n2){
		springArray[index]=new p5Spring(p5);
		springArray[index].setupNaturalLength(length);
		springArray[index].setupNode(n1,n2);
		myVars.springCount++;
	}

	var initializeGraphic=function(){
		var regNodeRadius=40 * myVars.screenSizeRatio;
		var largeNodeRadius=60 * myVars.screenSizeRatio;
		var regSpringLength=100 * myVars.screenSizeRatio;
		var randLength= 0; //100 * myVars.screenSizeRatio;	
		var longSpringLength= 200 * myVars.screenSizeRatio;//240 * myVars.screenSizeRatio;
		// var cGraphic="ff90b44b";
		// var cInteractive="ff00aa90";
		// var cTechnical="ff2ea9df";
		var cGraphic="ffffb11b";
		var cInteractive="ffcb1b45";
		var cTechnical="ffeb3015";
		var cUI="fff75c2f";
		createNodeArrayItem(myVars.nodeCount, largeNodeRadius, cGraphic, "Graphic");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createNodeArrayItem(myVars.nodeCount, largeNodeRadius, cInteractive, "Interactive");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createNodeArrayItem(myVars.nodeCount, largeNodeRadius, cTechnical, "Technical");
		nodeArray[myVars.nodeCount-1].setSkillLevel(270);
		
		createSpringArrayItem(myVars.springCount, longSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[0], nodeArray[1]);
		createSpringArrayItem(myVars.springCount, longSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[1], nodeArray[2]);
		createSpringArrayItem(myVars.springCount, longSpringLength+p5.floor(p5.random(randLength,randLength*2)), nodeArray[0], nodeArray[2]);

		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cGraphic, "Visual");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[0], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cGraphic, "Typography");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[0], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cGraphic, "Print");
		nodeArray[myVars.nodeCount-1].setSkillLevel(180);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[0], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cGraphic, "Layout");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[0], nodeArray[myVars.nodeCount-1]);

		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cInteractive, "Information Architecture");
		nodeArray[myVars.nodeCount-1].setSkillLevel(270);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[1], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cInteractive, "Cognative Psycology");
		nodeArray[myVars.nodeCount-1].setSkillLevel(180);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[1], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cInteractive, "Prototyping");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[1], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cUI, "UI");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(randLength/2,randLength)), nodeArray[0], nodeArray[myVars.nodeCount-1]);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(randLength/2,randLength)), nodeArray[1], nodeArray[myVars.nodeCount-1]);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(randLength/2,randLength)), nodeArray[2], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cInteractive, "User-Centred Design");
		nodeArray[myVars.nodeCount-1].setSkillLevel(270);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[1], nodeArray[myVars.nodeCount-1]);

		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cTechnical, "HTML/CSS");
		nodeArray[myVars.nodeCount-1].setSkillLevel(270);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[2], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cTechnical, "Javascript");
		nodeArray[myVars.nodeCount-1].setSkillLevel(270);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[2], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cTechnical, "Acctionscript");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[2], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cTechnical, "Processing");
		nodeArray[myVars.nodeCount-1].setSkillLevel(360);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[2], nodeArray[myVars.nodeCount-1]);
		createNodeArrayItem(myVars.nodeCount, regNodeRadius, cTechnical, "Android/JAVA");
		nodeArray[myVars.nodeCount-1].setSkillLevel(90);
		createSpringArrayItem(myVars.springCount, regSpringLength+p5.floor(p5.random(0,randLength)), nodeArray[2], nodeArray[myVars.nodeCount-1]);
	}
}

function p5Node(processing){
	var p5=processing;
	var node=this;	
	node.location=new p5.PVector();
	node.velocity=new p5.PVector();
	node.minAttractDistance=160.0;
	node.gravity=2*9.8;
	node.maxSpeed=15.0;
	node.damping=0.75;
	node.mass = 1.0;
	node.attractDirection=-1;
	node.attracting=false;
	node.radius=30;
	node.pieChartAngle=0;
 	node.targetAngle=0;
	node.name="interactive design";
	node.selected=0;
	node.showSkill=0;
	node.color="ffbdc0ba";

	node.setLocation=function(inputX, inputY){
		node.location.x=inputX;
		node.location.y=inputY;
	}

	node.setSelected=function(flag){
		node.selected=flag;
	}

	node.setShowSkill=function(flag){
		node.showSkill=flag;
	}

	node.setRadius=function(size){
		node.radius=size;		
	}

	node.setName=function(inputName){
		node.name=inputName;		
	}

	node.setColor=function(color){
		node.color=color;
	}
	node.setSkillLevel=function(level){
		node.targetAngle=level;
	}

	node.enlarge=function(){
		node.radius*=1.5;		
	}

	node.shrink=function(){
		node.radius/=1.5;		
	}
	
	node.attractArray=function(nodeArray){
		for(var i=0; i<nodeArray.length; i++){
			var otherNode=nodeArray[i];
			if(otherNode == null) break;
      		if(otherNode == node) continue;
      		node.attractOther(otherNode);
		}
	}

	node.attractOther=function(otherNode){
   		var centralDiff=p5.PVector.sub(node.location,otherNode.location);
	    var centralDist=centralDiff.mag();    
	    if(centralDist>0 && centralDist < node.minAttractDistance){
	      var distRatio = p5.pow(centralDist/node.minAttractDistance, 1);
	      var force = node.mass * node.mass * node.gravity * node.attractDirection /(centralDist*centralDist);
	      centralDiff.mult(force); 
	      otherNode.velocity.add(centralDiff);
	    }
	}

	node.update=function(){
		node.velocity.limit(node.maxSpeed);
		node.location.add(node.velocity);
		node.velocity.mult(node.damping);
	}

	node.render=function(){
		if(Boolean(node.showSkill)){
			p5.fill(145,152,159,60);
			p5.ellipse(node.location.x + myVars.shadowDisplacement * 6 * myVars.screenSizeRatio, 
					   node.location.y + myVars.shadowDisplacement * 6 * myVars.screenSizeRatio, 
					   node.radius - myVars.shadowDisplacement * 4 * myVars.screenSizeRatio, 
					   node.radius - myVars.shadowDisplacement * 4 * myVars.screenSizeRatio);		
		}else{
			p5.fill(145,152,159,150);
			p5.ellipse(node.location.x + myVars.shadowDisplacement, node.location.y + myVars.shadowDisplacement, node.radius,node.radius);
		}
		p5.fill(p5.unhex(node.color));
		p5.ellipse(node.location.x, node.location.y, node.radius,node.radius);
		p5.fill(255);		
		p5.ellipse(node.location.x, node.location.y, node.radius-node.radius/5,node.radius-node.radius/5);
		if(Boolean(node.showSkill)){
			p5.fill(247,92,47);
			node.drawPie();
		}
		//p5.fill(255);		
		//p5.ellipse(node.location.x, node.location.y, node.radius-node.radius/3,node.radius-node.radius/3);
	}

	node.drawPie=function(){
		var pieRadius=1 + (node.radius-node.radius/5)/2;
		var radTarget=p5.radians(node.targetAngle);
		var radPieChart=p5.radians(node.pieChartAngle + 1);
		p5.beginShape();
		p5.vertex(node.location.x,node.location.y);
		for(var i=0; i<=radPieChart; i+=0.01){
			var rotateAngle=i-p5.PI/2;
			p5.vertex(node.location.x + pieRadius*p5.cos(rotateAngle),node.location.y + pieRadius*p5.sin(rotateAngle));
		}
		p5.vertex(node.location.x,node.location.y);
		p5.endShape(p5.CLOSE);
		if(node.pieChartAngle<node.targetAngle)node.pieChartAngle+=20;
		if(node.pieChartAngle>=node.targetAngle)node.pieChartAngle=node.targetAngle;		
	}

	node.renderText=function(){
		p5.fill(79,79,72);
		var textWidth=p5.textWidth(node.name);
		p5.text(node.name,node.location.x-textWidth/2, node.location.y - 8 * myVars.screenSizeRatio-node.radius/2);
	}
}

function p5Spring(processing){
	var p5=processing;
	var spring=this;
	var springDir=new p5.PVector();
	var springDirInverse=new p5.PVector();
	var startNodeConnectUp=new p5.PVector();
	var startNodeConnectDown=new p5.PVector();
	var endNodeConnectUp=new p5.PVector();
	var endNodeConnectDown=new p5.PVector();
	var anchorU1=new p5.PVector();
	var anchorU2=new p5.PVector();
	var anchorD1=new p5.PVector();
	var anchorD2=new p5.PVector();

	spring.naturalLength=100.0;
	spring.currentLength=100.0;
	spring.damping=0.25;
	spring.curveRatio=20.0;
	spring.springFactor=1.2;
	spring.tension=189;
	spring.alpha=120;

	spring.setupNode=function(start, end){
		spring.startNode=start;
		spring.endNode=end;
		spring.calculateConnecting();
	}

	spring.setupNaturalLength=function(length){
		spring.naturalLength=length;		
	}	

	spring.calculateConnecting=function(){
		var startRotateAngle = 50;
		var endRotateAngle = 75;
		if(spring.startNode.radius > spring.endNode.radius)
		{
			startRotateAngle = 75;
			endRotateAngle = 50;
		}
		springDir = p5.PVector.sub(spring.endNode.location, spring.startNode.location);
		springDir.normalize();
		springDir.mult((spring.startNode.radius + 6) / 2);

		springDirInverse = p5.PVector.sub(spring.startNode.location, spring.endNode.location);
		springDirInverse.normalize();
		springDirInverse.mult((spring.endNode.radius + 6) / 2);


		startNodeConnectUp = spring.calVectorRotation(springDir.x, springDir.y, -1 * startRotateAngle).get();
		startNodeConnectUp.add(spring.startNode.location);		
		startNodeConnectDown = spring.calVectorRotation(springDir.x, springDir.y, startRotateAngle).get();
		startNodeConnectDown.add(spring.startNode.location);

		endNodeConnectUp = spring.calVectorRotation(springDirInverse.x, springDirInverse.y, endRotateAngle).get();
		endNodeConnectUp.add(spring.endNode.location);		
		endNodeConnectDown = spring.calVectorRotation(springDirInverse.x, springDirInverse.y, -1 * endRotateAngle).get();
		endNodeConnectDown.add(spring.endNode.location);

		var upCurveBaseLine = new p5.PVector.sub(endNodeConnectUp, startNodeConnectUp);
		var upCurveLength = upCurveBaseLine.mag() / 3;
		upCurveBaseLine.normalize();
		upCurveBaseLine.mult(upCurveLength);
		anchorU1 = p5.PVector.add(startNodeConnectUp, upCurveBaseLine);
		anchorU2 = p5.PVector.add(anchorU1, upCurveBaseLine);

		var upCurveBaseLineTan = spring.calVectorRotation(upCurveBaseLine.x, upCurveBaseLine.y, 90).get();
		upCurveBaseLineTan.normalize();
		upCurveBaseLineTan.mult(spring.curveRatio);
		anchorU1.add(upCurveBaseLineTan);
		anchorU2.add(upCurveBaseLineTan);

		var downCurveBaseLine = new p5.PVector.sub(endNodeConnectDown, startNodeConnectDown);
		var downCurveLength = downCurveBaseLine.mag() / 3;
		downCurveBaseLine.normalize();
		downCurveBaseLine.mult(downCurveLength);
		anchorD1 = p5.PVector.add(startNodeConnectDown, downCurveBaseLine);
		anchorD2 = p5.PVector.add(anchorD1, downCurveBaseLine);

		var downCurveBaseLineTan = spring.calVectorRotation(downCurveBaseLine.x, downCurveBaseLine.y, -90).get();
		downCurveBaseLineTan.normalize();
		downCurveBaseLineTan.mult(spring.curveRatio);
		anchorD1.add(downCurveBaseLineTan);
		anchorD2.add(downCurveBaseLineTan);
	}

	spring.calVectorRotation=function(iniX, iniY, angle){
		var resultVector=new p5.PVector();
		resultVector.x = iniX * p5.cos(p5.radians(angle)) - iniY * p5.sin(p5.radians(angle));
		resultVector.y = iniX * p5.sin(p5.radians(angle)) + iniY * p5.cos(p5.radians(angle));
		return resultVector;
	}

	spring.calculateShape=function(){
		//calculate connection
	}

	spring.update=function(){
		var diff=p5.PVector.sub(spring.endNode.location, spring.startNode.location);
		spring.currentLength=diff.mag();
		var displacement=spring.currentLength-spring.naturalLength;
		var forceStrength=displacement*spring.springFactor;		
		diff.normalize();
		var target=p5.PVector.add(spring.startNode.location,diff);
		var force=p5.PVector.mult(diff,forceStrength);
		force.mult(spring.damping);
		spring.startNode.velocity.add(force);
		spring.endNode.velocity.add(p5.PVector.mult(force,-1));
		spring.tension=189 * spring.currentLength/ spring.naturalLength;
		spring.alpha = 120.0 * spring.naturalLength / spring.currentLength;
		spring.alpha = p5.constrain(spring.alpha, 0, 240);
		spring.curveRatio = 20.0 * spring.currentLength / spring.naturalLength;
		spring.curveRatio = p5.constrain(spring.curveRatio, 5, 30 * myVars.screenSizeRatio);

		spring.calculateConnecting();
	}

	spring.render=function(){		
		spring.renderCurveConnection();
		//spring.debugGraph();
	}

	spring.renderLineConnection=function(){
		var lineWidth=4 * myVars.screenSizeRatio;
		lineWidth=p5.max(lineWidth, 1);		
		p5.strokeWeight(lineWidth);		
		p5.stroke(145,152,159,200);
		p5.line(spring.startNode.location.x + myVars.shadowDisplacement/2, spring.startNode.location.y + myVars.shadowDisplacement/2,
				spring.endNode.location.x + myVars.shadowDisplacement/2, spring.endNode.location.y + myVars.shadowDisplacement/2);
		p5.stroke(spring.tension,192,186);
		p5.line(spring.startNode.location.x, spring.startNode.location.y,
				spring.endNode.location.x, spring.endNode.location.y);
	}

	spring.renderCurveConnection=function(){
		p5.noStroke();
		p5.fill(145,152,159,spring.alpha / 2);
		p5.pushMatrix();
		p5.translate(myVars.shadowDisplacement, myVars.shadowDisplacement);
		spring.renderCurveShape();
		p5.popMatrix();
		p5.stroke(145, 152, 159, spring.alpha * 2 / 3);
		p5.fill(252, 250, 242, spring.alpha);
		spring.renderCurveShape();
	}

	spring.renderCurveShape=function(){
		p5.beginShape();
		p5.vertex(startNodeConnectUp.x, startNodeConnectUp.y);
		p5.bezierVertex(anchorU1.x, anchorU1.y, anchorU2.x, anchorU2.y, endNodeConnectUp.x, endNodeConnectUp.y);
		p5.vertex(endNodeConnectDown.x, endNodeConnectDown.y);
		p5.bezierVertex(anchorD2.x, anchorD2.y, anchorD1.x, anchorD1.y, startNodeConnectDown.x, startNodeConnectDown.y);
		p5.vertex(startNodeConnectDown.x, startNodeConnectDown.y);
		p5.endShape();	
		p5.ellipse(spring.startNode.location.x, spring.startNode.location.y , 
			spring.startNode.radius + 6, spring.startNode.radius + 6);
		p5.ellipse(spring.endNode.location.x, spring.endNode.location.y , 
			spring.endNode.radius + 6, spring.endNode.radius + 6);	
	}

	spring.debugGraph=function(){
		p5.ellipse(startNodeConnectUp.x, startNodeConnectUp.y ,10, 10);
		p5.ellipse(startNodeConnectDown.x, startNodeConnectDown.y ,10, 10);
		p5.ellipse(endNodeConnectUp.x, endNodeConnectUp.y ,10, 10);
		p5.ellipse(endNodeConnectDown.x, endNodeConnectDown.y ,10, 10);
		p5.ellipse(anchorU1.x, anchorU1.y ,10, 10);
		p5.ellipse(anchorU2.x, anchorU2.y ,10, 10);
		p5.ellipse(anchorD1.x, anchorD1.y ,10, 10);
		p5.ellipse(anchorD2.x, anchorD2.y ,10, 10);
	}
}