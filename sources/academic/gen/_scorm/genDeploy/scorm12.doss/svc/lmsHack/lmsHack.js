// Hack  : suppression de la recherche scorm2004 car pose des pbs sur de nombreuses LMS
if(scServices.scorm2k4) {
	scServices.scorm2k4.xInitScorm2k4 = function(){ return false;};
}