export const getDbCredentials = async () => {
  return {
    port: 5432,
    dbname: 'fastfood-orders',
    username: 'postgres',
    password: 'postgres',
  }
};