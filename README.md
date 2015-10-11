# simple-asp-orm
simple-asp-orm is a simple ASP ORM written in Jscript language. The inspiration comes from active_record of Rails 2.

## Example code

### find
``` javascript
$("T.TableName").find(id);
```

### find by conditions
``` javascript
$("T.TableName").find(
  only: ["id","title","category_id","author","is_top","publication","created_at","updated_at"], // fields
  {conditions: "is_deleted <>'y' and category_id="+pid
);
```

### pagination
``` javascript
$("T.TableName").find(
  only: ["id","title","category_id","author","is_top","publication","created_at","updated_at"], // fields
  {conditions: "is_deleted <>'y' and category_id="+pid,
  limit: limit, 
  start: start
);
```

### create
``` javascript
var article = {};
article.title = title;
$("T.articles").add(article);
```

### update
``` javascript
var article = {};
article.id = id;
article.title = title;
$("T.articles").update(article);
```

## delete
``` javascript
$("T.TableName").del(id);
```

### count
``` javascript
$("T.TableName").find(
  {conditions: "is_deleted <>'y' and category_id="+pid
).count;
```