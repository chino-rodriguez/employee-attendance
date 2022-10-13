CREATE TABLE IF NOT EXISTS Employee (
    id UUID UNIQUE,
    firstname varchar(20) NOT NULL,
    lastname varchar(20) NOT NULL,
    username varchar(15) PRIMARY KEY NOT NULL UNIQUE,
    password varchar(20) NOT NULL
);

--SELECT * FROM Employee;

CREATE TABLE IF NOT EXISTS Wage (
    id uuid UNIQUE,
    position varchar(20) PRIMARY KEY NOT NULL UNIQUE,
    wage decimal
    );
    
--SELECT * FROM Wage;

CREATE TABLE IF NOT EXISTS Entry (
    id UUID UNIQUE,
    employeeid UUID NOT NULL,
        CONSTRAINT fk_employeeid
        FOREIGN KEY (employeeid)
        REFERENCES Employee(id),
    date date NOT NULL,
    timein timestamptz NOT NULL,
    timeout timestamptz NOT NULL,
    hours decimal,
    position varchar(20) NOT NULL,
        CONSTRAINT fk_position
        FOREIGN KEY (position)
        REFERENCES Wage(position),
    salary decimal 
);

-- SELECT * FROM Entry;

-- ROUGH DRAFT OF BACKEND OPERATIONS

-- SHOW Entries
-- SELECT * FROM Entry WHERE employeeid = (currentUserId);

-- INSERT Entry
-- SELECT wage from Wage WHERE position = position
-- hours = timeout - timein
-- salary = wage * hours
-- INSERT INTO Entry (id, employeeid, date, timein, timeout, hours, position, salary) VALUES ()

-- DELETE Entry
-- DELETE from Entry WHERE id = (selectedId);