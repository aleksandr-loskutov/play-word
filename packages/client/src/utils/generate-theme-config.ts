import CONSTS from './consts';

type CssCustomPropsType = typeof CONSTS.THEME_CUSTOM_CSS_PROPS;

const generateThemeConfig = (
  components: string[],
  customProps: CssCustomPropsType,
) => {
  return components.reduce(
    (acc: { [key: string]: CssCustomPropsType }, componentName) => {
      acc[componentName] = customProps;
      return acc;
    },
    {},
  );
};

export default generateThemeConfig;
