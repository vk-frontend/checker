CREATE TABLE sections
(
    section TEXT NOT NULL UNIQUE,
    module TEXT NOT NULL,
    statics TEXT NOT NULL
);

CREATE UNIQUE INDEX section ON sections
(
    module
);