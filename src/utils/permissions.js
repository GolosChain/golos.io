export function getNecessaryDelay(permissions, role) {
  const ownerPerm = permissions.find(({ perm_name }) => perm_name === role);

  if (!ownerPerm) {
    throw new Error('Owner key not found');
  }

  const { threshold, keys, waits } = ownerPerm.required_auth;

  if (!waits || waits.length === 0) {
    return 0;
  }

  const keyWeight = keys[0]?.weight || 0;
  const waitWeight = waits[0].weight;

  if (keyWeight >= threshold || keyWeight + waitWeight < threshold) {
    return 0;
  }

  return waits[0].wait_sec;
}
