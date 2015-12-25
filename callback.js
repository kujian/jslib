if ( callback && typeof callback === ‘function’ ) {
callback.call( this, value );
} else {
return value;
}

This is roughly how jQuery().html() works and speaking of jQuery, this is how chaining is accomplished for functions that must return a value.

example:
var foo = {
bar1 : function() {
// do something
return this; // continue the chain
},
bar2 : function( fn ) {
// do something
fn.call( this, returnValue );
return this;
}
}

foo.bar2(function( returnValue ) {
// alert returnValue
}).bar1();
