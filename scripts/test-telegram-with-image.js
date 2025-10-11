require('dotenv').config({ path: '.env.local' });
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

const chatId = '7623040522'; // Your Chat ID
const imageUrl = `${process.env.NGROK_URL}/snapshots/snapshot_1760188904216400.jpg`;

console.log('🧪 Testing Telegram notification with image...\n');
console.log('📍 NGROK_URL:', process.env.NGROK_URL);
console.log('🖼️  Image URL:', imageUrl);
console.log('💬 Chat ID:', chatId);
console.log('\n📤 Sending test notification...\n');

bot.sendPhoto(chatId, imageUrl, {
  caption: `🚨 *TEST NOTIFIKASI KECELAKAAN* 🚨\n\n*Lokasi:* Kota Malang\n*Klasifikasi:* Serious\n*Waktu:* ${new Date().toLocaleString('id-ID')}\n\n📍 *Lokasi GPS:*\nhttps://www.google.com/maps?q=-7.9797,112.6304\n\n⚠️ *INI ADALAH PESAN TEST*\n\nJika Anda menerima pesan ini dengan gambar, sistem Telegram bekerja dengan baik!`,
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [[
      { text: '✅ Tangani', callback_data: 'handle_test' },
      { text: '❌ Tolak', callback_data: 'reject_test' }
    ]]
  }
})
.then(response => {
  console.log('✅ Test notification sent successfully!');
  console.log('\n📱 Check your Telegram app (@Sentra_message_bot)');
  console.log('   You should see:');
  console.log('   - Accident snapshot image');
  console.log('   - Accident details in Indonesian');
  console.log('   - Google Maps link');
  console.log('   - Two buttons: Tangani and Tolak\n');
  process.exit(0);
})
.catch(error => {
  console.error('❌ Failed to send test notification:');
  console.error('Error:', error.message);
  if (error.response && error.response.body) {
    console.error('Telegram API Response:', error.response.body);
  }
  console.error('\n💡 Possible issues:');
  console.error('   - NGROK_URL is incorrect or expired');
  console.error('   - Ngrok tunnel is not running');
  console.error('   - Image file does not exist');
  console.error('   - Telegram cannot access the image URL\n');
  process.exit(1);
});
