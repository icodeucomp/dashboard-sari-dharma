module.exports = {
  apps: [
    {
      // Nama aplikasi di dashboard PM2
      name: "backoffice-klinik-sari-dharma",
      // Perintah untuk menjalankan aplikasi
      script: "npm",
      args: "start",
      // Pengaturan lingkungan
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      // Jumlah instans yang akan dijalankan
      instances: 1,
      // Otomatis restart jika aplikasi crash
      autorestart: true,
      // Pantau penggunaan memori
      watch: false,
      // Atur batas memori (opsional)
      max_memory_restart: "500M",
      // Log aplikasi
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      // Output untuk error dan output standar
      error_file: "./logs/error.log",
      out_file: "./logs/output.log"
    }
  ]
};
