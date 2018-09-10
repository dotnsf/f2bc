// main.js
async function myAction( params ){
  try{
    const obj = await login( params );
    return obj;
  }catch( err ){
    return err;
  }
}

function login( params ){
  return new Promise( function( resolve, reject ){
    const settings = require( './settings' );
    const HyperledgerClient = require( './hyperledger-client' );
    const client = new HyperledgerClient();
    const id = params.id;
    const password = params.password;

    if( id && password ){
      client.getUserForLogin( id, user => {
        if( id && password && user.password == password ){
          var token = jwt.sign( user, settings.superSecret, { expiresIn: '25h' } );
          resolve( { status: true, token: token );
        }else{
          reject( { status: false, error: 'id and/or password invalid.' } );
        }
      }, error => {
        reject( { status: false, error: error } );
      });
    }else{
      reject( { status: false, error: 'id and/or password invalid.' } );
    }
  });
}

function getDatetime(){
  var dt = new Date();
  var yyyy = dt.getFullYear();
  var mm = dt.getMonth() + 1;
  var dd = dt.getDate();
  var hh = dt.getHours();
  var nn = dt.getMinutes();
  var ss = dt.getSeconds();
  var tz = dt.getTimezoneOffset() / 60;
  var datetime = yyyy + '-' + ( mm < 10 ? '0' : '' ) + mm + '-' + ( dd < 10 ? '0' : '' ) + dd
    + ' ' + ( hh < 10 ? '0' : '' ) + hh + ':' + ( nn < 10 ? '0' : '' ) + nn + ':' + ( ss < 10 ? '0' : '' ) + ss
    + ( tz > 0 ? '-' : '+' ) + ( Math.abs( tz ) < 10 ? '0' : '' ) + Math.abs( tz );
  return datetime;
}

exports.main = myAction;
