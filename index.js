class QueryBuilder {
  constructor(table) {
    if (!table) {
      throw new Error("Table name is required.");
    }
    this.table = table;
    this.columns = ["*"];
    this.whereConditions = [];
    this.orderByColumns = [];
    this.groupByColumns = [];
    this.havingConditions = [];
    this.limit = null;
    this.offset = null;
    this.joinClauses = [];
    this.calledSelect = false;
    this.query = "";
  }

  select(...columns) {
    this.calledSelect = true;
    this.columns = columns.length ? columns : ["*"];
    return this;
  }

  where(column, operator, value) {
    if (!column || !operator) {
      throw new Error("Column and operator are required for WHERE conditions.");
    }
    this.whereConditions.push({ column, operator, value });
    return this;
  }

  orderBy(column, direction = "ASC") {
    this.orderByColumns.push({ column, direction });
    return this;
  }

  groupBy(...columns) {
    this.groupByColumns.push(...columns);
    return this;
  }

  having(column, operator, value) {
    this.havingConditions.push({ column, operator, value });
    return this;
  }

  join(table, onCondition, type = "INNER") {
    type = type.toUpperCase();
    if (!["INNER", "LEFT", "RIGHT", "FULL"].includes(type)) {
      throw new Error(
        "Invalid join type. Supported types: INNER, LEFT, RIGHT, FULL."
      );
    }
    this.joinClauses.push({ table, onCondition, type });
    return this;
  }

  insert(data) {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data)
      .map((val) => `'${val}'`)
      .join(", ");
    return `INSERT INTO ${this.table} (${columns}) VALUES (${values})`;
  }

  update(data) {
    const setValues = Object.entries(data)
      .map(([column, value]) => `${column} = '${value}'`)
      .join(", ");
    this.query += `UPDATE ${this.table} SET ${setValues}`;
    return this;
  }

  delete() {
    this.query += `DELETE FROM ${this.table}`;
    return this;
  }

  commit() {
    return "COMMIT";
  }

  rollback() {
    return "ROLLBACK";
  }

  build() {
    if (this.calledSelect) {
      this.query = `SELECT ${this.columns.join(", ")} FROM ${this.table}`;
    }
    if (this.joinClauses.length && this.calledSelect) {
      this.joinClauses.forEach(({ table, onCondition, type }) => {
        this.query += ` ${type} JOIN ${table} ON ${onCondition}`;
      });
    }

    if (this.whereConditions.length) {
      const whereClauses = this.whereConditions.map(
        ({ column, operator, value }) => {
          if (isNaN(value)) return `${column} ${operator} '${value}'`;
          else return `${column} ${operator} ${value}`;
        }
      );
      this.query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    if (this.groupByColumns.length && this.calledSelect) {
      this.query += ` GROUP BY ${this.groupByColumns.join(", ")}`;
    }

    if (this.havingConditions.length && this.calledSelect) {
      const havingClauses = this.havingConditions.map(
        ({ column, operator, value }) => {
          if (isNaN(value)) return `${column} ${operator} '${value}'`;
          else return `${column} ${operator} ${value}`;
        }
      );
      this.query += ` HAVING ${havingClauses.join(" AND ")}`;
    }

    if (this.orderByColumns.length && this.calledSelect) {
      const orderByClauses = this.orderByColumns.map(
        ({ column, direction }) => {
          return `${column} ${direction}`;
        }
      );
      this.query += ` ORDER BY ${orderByClauses.join(", ")}`;
    }

    if (this.limit !== null && this.calledSelect) {
      this.query += ` LIMIT ${this.limit}`;
    }

    if (this.offset !== null && this.calledSelect) {
      this.query += ` OFFSET ${this.offset}`;
    }

    return this.query;
  }
}

module.exports = QueryBuilder;
