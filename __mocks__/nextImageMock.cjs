module.exports = function NextImageMock(props) {
  return {
    $$typeof: Symbol.for('react.element'),
    type: 'img',
    ref: null,
    key: null,
    props: {
      ...props,
    },
    _owner: null,
  };
};
