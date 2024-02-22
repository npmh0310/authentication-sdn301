var passport = require('passport'); // import module passport từ thư viện passport
var LocalStrategy = require('passport-local').Strategy; // import module LocalStrategy từ passport-local. LocalStrategy là một cách xác thực người dùng sử dụng tên người dùng và mật khẩu được cung cấp trong ứng dụng.
var User = require('./models/user');

passport.use(new LocalStrategy(User.authenticate())); //  khởi tạo một LocalStrategy với phương thức xác thực là User.authenticate(). 
passport.serializeUser(User.serializeUser()); // định nghĩa cách mã hóa người dùng để lưu trữ trong phiên. 
passport.deserializeUser(User.deserializeUser()); //  định nghĩa cách giải mã người dùng từ dữ liệu được lưu trữ trong phiên.
