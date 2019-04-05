// Hack  : suppression de la recherche scorm12 car pose des pbs sur la majeure partie des LMS
if(scServices.scorm12) {
	scServices.scorm12.xInitScorm12 = function(){ return false;};
}
