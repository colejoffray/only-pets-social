
module.exports = {
    if_eq: function (a, b, opts) {
      if (a === b) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    },
    if_includes: function (array,b,opts){
      if(array.includes(b)){
        return opts.fn(this)
      }else {
        return opts.inverse(this)
      }
    }
  };
  