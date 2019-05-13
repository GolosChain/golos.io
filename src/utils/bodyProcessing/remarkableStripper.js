import Remarkable from 'remarkable';

const remarkable = new Remarkable();

/**
 * Removes all markdown, leaving just plain text
 */
function remarkableStripper(md) {
  md.renderer.render = (tokens, options, env) => {
    const list = [];

    for (let i = 0; i < tokens.length; i++) {
      let str;

      if (tokens[i].type === 'inline') {
        str = md.renderer.render(tokens[i].children, options, env);
      } else {
        str = `${tokens[i].content || ''} `;
      }

      list.push(str);
    }

    return list.join('');
  };
}

remarkable.use(remarkableStripper);

export default remarkable;
