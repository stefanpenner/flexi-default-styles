/* jshint node:true */
/**
 An HTMLBars AST transformation that converts instances of
 layout elements to their corresponding layout-component
 */
// these elements are always converted to components
var LayoutComponents = ['centered', 'container'];

// The actual components will always have this prefix
var ComponentPrefix = 'flexi-';

function ComponentConversionSupport() {
  this.syntax = null;
}

ComponentConversionSupport.prototype.transform = function ComponentConversionSupport_transform(ast) {
  var b = this.syntax.builders;
  var pluginContext = this;
  var walker = new pluginContext.syntax.Walker();

  walker.visit(ast, function(element) {
    if (pluginContext.validate(element)) {
      var program = b.program(element.children);
      var tag = ComponentPrefix + element.tag;
      var component = b.block(tag, null, makeHash(element.attributes), program, null, element.loc);

      replaceReference(element, component);
    }
  });

  return ast;
};

function replaceReference(a, b) {
  Object.keys(a).forEach(function(key) {
    delete a[key];
  });
  Object.keys(b).forEach(function(key) {
    a[key] = b[key];
  });
}

function makeHash(attrs) {
  if (!attrs || !attrs.length) {
    return {};
  }

  attrs.forEach(function(attr) {
    attr.type = 'HashPair';
    attr.value.type = 'StringLiteral';
  });

  console.log(attrs);

  return {
    pairs: attrs
  };
}

ComponentConversionSupport.prototype.validate = function ComponentConversionSupport_validate(node) {
  var isElement = node.type === 'ElementNode';
  // is dashless component
  return isElement && LayoutComponents.indexOf(node.tag) !== -1;
};

module.exports = ComponentConversionSupport;
