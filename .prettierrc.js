module.exports = {
  importOrder: ["^\\.\\./(?!.*\\.[a-z]+$)(.*)$", "^\\./(?!.*\\.[a-z]+$)(.*)$"],
  importOrderSeparation: true,
  importOrderParserPlugins: ["jsx", "typescript"],
  trailingComma: "none"
};
