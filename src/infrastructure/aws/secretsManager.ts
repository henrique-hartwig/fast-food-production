export const getDbCredentials = async () => {
  return {
    host: 'localhost',
    port: 5432,
    dbname: 'fastfood-orders',
    username: 'postgres',
    password: 'postgres',
  }
};