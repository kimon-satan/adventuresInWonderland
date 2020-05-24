
const express = require('express');
const app = express();
const port = 3000;

// require modules
const fs = require('fs');
const archiver = require('archiver');

app.get('/', (req, res) =>{

  // create a file to stream archive data to.
  res.attachment('adventuresInWonderland.zip');

  let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });


  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err)
  {
    if (err.code === 'ENOENT')
    {
      // log warning
      console.log(err);
    } else {
      // throw error
      res.status(500).send({error: err.message});
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
  	res.status(500).send({error: err.message});
  });

  // pipe archive data to the file
  archive.pipe(res);

  archive.append(__dirname + 'assets/README', { name: 'README' });
  archive.append(__dirname + '/assets/FINDME', { name: 'rabbitHole/FINDME' });

  archive.finalize();

})






app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
