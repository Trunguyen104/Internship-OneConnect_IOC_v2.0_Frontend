/**
 * Maps Ant Design Table column definitions to DataTable column shape.
 * Keeps (value, record, index) render contract from antd.
 */

function getByPath(obj, path) {
  if (path == null) return undefined;
  if (Array.isArray(path)) {
    return path.reduce((o, k) => (o == null ? o : o[k]), obj);
  }
  return obj?.[path];
}

export function mapAntdColumnsToDataTable(columns = []) {
  if (!Array.isArray(columns)) return [];

  return columns.map((col, index) => {
    const dataKey = col.dataIndex ?? col.key;
    const keyStr =
      dataKey != null
        ? Array.isArray(dataKey)
          ? dataKey.join('.')
          : String(dataKey)
        : col.key != null
          ? String(col.key)
          : `col-${index}`;

    return {
      title: col.title,
      key: keyStr,
      width: col.width,
      align: col.align,
      className: col.className,
      sortKey: col.sorter ? keyStr : undefined,
      sorter: col.sorter,
      render: (val, record, idx) => {
        if (col.render) {
          const cellValue = col.dataIndex != null ? getByPath(record, col.dataIndex) : val;
          return col.render(cellValue, record, idx);
        }
        return val;
      },
    };
  });
}
