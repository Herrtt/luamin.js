local a = function() end;
local b = (1 + 1 or a);(a)();
local c = (a or b)
print(a() or 'Hello World!')