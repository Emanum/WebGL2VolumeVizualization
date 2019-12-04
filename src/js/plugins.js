function readTextFile(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  var erg;
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        erg =  rawFile.responseText;
      }
    }
  }
  rawFile.send(null);
  return erg;
}

// Place any jQuery/helper plugins in here.
