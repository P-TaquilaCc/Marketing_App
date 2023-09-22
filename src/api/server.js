import axios from "axios";
import "../../global";

export default axios.create({
  baseURL: global.url,
});
