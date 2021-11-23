import axios from 'axios';

export default axios.create({
  baseURL: 'https://discord.com/api/v8/',
  headers: {
    Authorization: `Bot ${process.env.D_TOKEN}`
  }
});
