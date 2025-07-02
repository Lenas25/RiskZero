USE [master]
GO

-- Check if the database exists, if not, create it.
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'supplier_management_db')
BEGIN
    CREATE DATABASE [supplier_management_db];
END
GO

USE [supplier_management_db]
GO

-- Set options for table creation
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Table: countries
CREATE TABLE [dbo].[countries](
    [country_id] [int] IDENTITY(1,1) NOT NULL,
    [name] [nvarchar](100) NOT NULL,
    [iso_code] [char](3) NOT NULL,
PRIMARY KEY CLUSTERED 
(
    [country_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
    [iso_code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
    [name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table: suppliers
CREATE TABLE [dbo].[suppliers](
    [tax_id] [varchar](11) NOT NULL,
    [legal_name] [nvarchar](100) NOT NULL,
    [trade_name] [nvarchar](100) NOT NULL,
    [phone_number] [varchar](50) NULL,
    [email] [nvarchar](50) NULL,
    [website] [nvarchar](150) NULL,
    [physical_address] [nvarchar](300) NULL,
    [country_id] [int] NOT NULL,
    [annual_revenue_usd] [decimal](18, 2) NULL,
    [updated_at] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
    [tax_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [uq_suppliers_email] UNIQUE NONCLUSTERED 
(
    [email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [uq_suppliers_tax_id] UNIQUE NONCLUSTERED 
(
    [tax_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Table: users
CREATE TABLE [dbo].[users](
    [id] [int] IDENTITY(1,1) NOT NULL,
    [email] [nvarchar](100) NOT NULL,
    [password] [nvarchar](100) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
    [id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
    CONSTRAINT [users_unique] UNIQUE NONCLUSTERED 
(
    [email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Add default value for updated_at column in suppliers table
ALTER TABLE [dbo].[suppliers] ADD DEFAULT (getdate()) FOR [updated_at]
GO

-- Add foreign key constraint for country_id in suppliers table, referencing countries table
ALTER TABLE [dbo].[suppliers] WITH CHECK ADD CONSTRAINT [fk_suppliers_countries] FOREIGN KEY([country_id])
REFERENCES [dbo].[countries] ([country_id])
GO

ALTER TABLE [dbo].[suppliers] CHECK CONSTRAINT [fk_suppliers_countries]
GO

-- Add check constraint for annual_revenue_usd in suppliers table (must be non-negative)
ALTER TABLE [dbo].[suppliers] WITH CHECK ADD CONSTRAINT [chk_suppliers_annual_revenue] CHECK (([annual_revenue_usd]>=(0)))
GO

ALTER TABLE [dbo].[suppliers] CHECK CONSTRAINT [chk_suppliers_annual_revenue]
GO

-- --- Sample Data Insertion ---

USE [supplier_management_db]
GO

-- Insert data into countries
SET IDENTITY_INSERT [dbo].[countries] ON;
INSERT INTO [dbo].[countries] ([country_id], [name], [iso_code]) VALUES
    (1, N'Mexico', N'MX '),
    (2, N'Spain', N'ES '),
    (3, N'Argentina', N'AR '),
    (4, N'Colombia', N'CO '),
    (5, N'United States', N'US '),
    (6, N'Chile', N'CL '),
    (7, N'Peru', N'PE ');
SET IDENTITY_INSERT [dbo].[countries] OFF;
GO

-- Insert data into users
SET IDENTITY_INSERT [dbo].[users] ON;
INSERT INTO [dbo].[users] ([id], [email], [password]) VALUES
    (1, N'admin@example.com', N'hashed_password_1'), -- In a real application, always hash passwords securely!
    (2, N'user@example.com', N'hashed_password_2'),
    (5, N'easp0104@gmail.com', N'$2a$11$UbS4UpOKI58vjw02qsN0dOY0odhknUnWDPPtFcD4XHf9awwQ2OQt.');
SET IDENTITY_INSERT [dbo].[users] OFF;
GO

-- Insert data into suppliers
INSERT INTO [dbo].[suppliers] ([tax_id], [legal_name], [trade_name], [phone_number], [email], [website], [physical_address], [country_id], [annual_revenue_usd], [updated_at]) VALUES
    (N'03257841259', N'Logistica Andina S.A.S.', N'LogiAndina', N'+5716543210', N'sales@logiandina.co', N'https://www.logisticandina.com', N'Carrera 7 # 71-21, Bogota, D.C.', 4, 4250000.00, '2025-06-30 07:47:51.6215294'),
    (N'15278569423', N'Aceros del Norte S.A. de C.V.', N'Aceros del Norte', N'+528183299900', N'contact@acerosdelnorte.com', N'https://www.acerosdelnorte.com', N'Av. de la Industria 123, Monterrey, Nuevo Leon', 1, 15000000.75, '2025-06-29 12:17:04.5133333'),
    (N'63587412594', N'Global Supplies LLC', N'Global Supplies', N'+12125550123', N'sales@globalsupplies.com', N'https://www.globalsupplies.com', N'1500 Broadway, New York, NY 10036', 5, 25000000.00, '2025-06-29 12:17:04.5133333'),
    (N'85412576359', N'coesa', N'Coesa', N'+34911234567', N'info@techiberia.es', N'https://www.techiberia.essss', N'Calle de la Innovacion 45, 28020 Madrid', 2, 8500000.01, '2025-06-30 19:44:32.3908944');
GO
