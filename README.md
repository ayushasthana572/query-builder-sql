# query-builder-sql
The SQL Query Builder is a versatile library that allows you to construct SQL queries in JavaScript. This library allows you to create parameterized queries, handle complex expressions, perform subqueries, and more.
# Installation
`npm i query-builder-sql`
# Usage
1. Create an instance of the QueryBuilder class by specifying the table name:
   
```
 const query = new QueryBuilder('table-name');
```
2. Chain methods to build your query:
 ```
 query
  .select('order_id', 'total_amount')
  .where('status', '=', 'shipped')
  .orderBy('created_at', 'DESC')
  .groupBy('country', 'region')
  .having('SUM(total_amount)', '>', 10000)
  .join('customers', 'orders.customer_id = customers.customer_id', 'LEFT')
  .paginate(2, 10);
```
3. Execute the query
 ```
const sqlQuery = query.build();
```
# Methods
- select(...columns): Specify the columns to select.
- where(column, operator, value): Add a WHERE condition.
- orderBy(column, direction): Specify the order of results.
- groupBy(...columns): Group results by specified columns.
- having(column, operator, value): Add a HAVING condition.
- join(table, onCondition, type): Add a JOIN clause.
- insert(data): Construct an INSERT INTO query.
- update(data): Construct an UPDATE query.
- delete(): Construct a DELETE query.
- commit(): Execute a COMMIT statement.
- rollback(): Execute a ROLLBACK statement.
# Examples
 Let’s walk through some examples of how to use the SQL Query Builder.
 1. Select Query
    - Retrieve order details for shipped orders:
      ```
      const selectQuery = new QueryBuilder('orders')
        .select('order_id', 'total_amount')
        .where('status', '=', 'shipped')
        .build();

      console.log(selectQuery);
      // Output: SELECT order_id, total_amount FROM orders WHERE status = 'shipped'

      ```
 2. Insert Query
     - Insert a new order:
       ```
       const insertQuery = new QueryBuilder('orders')
          .insert({ order_id: 123, total_amount: 500 })

       console.log(insertQuery);
       // Output: INSERT INTO orders (order_id, total_amount) VALUES (123, 500)

       ```
 3. Update Query
    - Update the status of an order:
      ```
      const updateQuery = new QueryBuilder('orders')
        .update({ status: 'delivered' })
        .where('order_id', '=', 123)
        .build();

      console.log(updateQuery);
      // Output: UPDATE orders SET status = 'delivered' WHERE order_id = 123

      ```
 4. Delete Query
    - Delete all cancelled orders: 
      ```
       const deleteQuery = new QueryBuilder('orders')
          .delete()
          .where('status', '=', 'canceled')
          .build();
  
       console.log(deleteQuery);
       // Output: DELETE FROM orders WHERE status = 'canceled'

      ```
5. Join Query
   - Retrieve order details along with customer information:
     ```
     const joinQuery = new QueryBuilder('orders')
        .select('orders.order_id', 'orders.total_amount', 'customers.customer_name')
        .join('customers', 'orders.customer_id = customers.customer_id', 'LEFT')
        .build();

      console.log(joinQuery);
      // Output: SELECT orders.order_id, orders.total_amount, customers.customer_name
      //         FROM orders
      //         LEFT JOIN customers ON orders.customer_id = customers.customer_id

     ```
 6. SubQuery:
    - Retrieve employees whose salary is greater than the average salary across all employees:
      ```
      const subquery = new QueryBuilder('employees')
          .select('AVG(salary)')
          .build();

      const mainQuery = new QueryBuilder('employees')
          .select('id', 'last_name', 'salary')
          .where('salary', '>', `(${subquery})`)
          .build();

      console.log(mainQuery);
      // Output: SELECT id, last_name, salary
      //         FROM employees
      //         WHERE salary > (SELECT AVG(salary) FROM employees)

      ```
# Contributing 
  Feel free to contribute by opening issues or pull requests. Let’s make this query builder even better!
