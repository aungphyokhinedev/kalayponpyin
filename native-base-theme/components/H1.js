import variable from './../variables/platform';

export default (variables = variable) => {
  const h1Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH1,
    lineHeight: variables.lineHeightH1,
    fontWeight: '900',
    textAlignVertical: 'center',
    paddingTop: 10,
  };

  return h1Theme;
};
