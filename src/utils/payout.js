export const payoutSum = entity =>
  ['author', 'curator', 'benefactor'].reduce(
    (parentPrev, parentKey) => {
      const parent = entity.payout[parentKey];
      if (!parent) {
        return parentPrev;
      }

      // Sum of token and vesting
      const childrenSum = ['token', 'vesting'].reduce((childrenPrev, childrenKey) => {
        const children = parent[childrenKey];
        if (!children) {
          return childrenPrev;
        }

        const { name, value } = children;

        if (!name || !value) {
          return childrenPrev;
        }

        // TODO: change value of ticker `name` by currency
        childrenPrev += value;

        return childrenPrev;
      }, 0);

      // Apply
      // if (!parentPrev.byType[parentKey]) {
      //   parentPrev.byType[parentKey] = 0;
      // }
      // parentPrev.byType[parentKey] += childrenSum;
      // parentPrev.total += childrenSum;
      parentPrev += childrenSum;

      return parentPrev;
    },
    0
    // { total: 0, byType: {} }
  );
