# simple-asp-orm
simple-asp-orm is a simple asp orm written in Jscript language. The inspiration comes from active_record of Rails 2.

## Example code
``` javascript
$("T.TableName").find(
  only: ["id","title","category_id","author","is_top","publication","created_at","updated_at"], // fields
  {conditions: "is_deleted <>'y' and category_id="+pid,
  limit: limit, 
  start: start
);
```

``` javascript
$("T.TableName").find(
  {conditions: "is_deleted <>'y' and category_id="+pid
).count;
```