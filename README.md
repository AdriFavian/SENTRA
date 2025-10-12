# 🚨 SENTRA - Smart Sensor-based Traffic Accident Alert

## 📖 Introduction

SENTRA is a cutting-edge system designed to enhance highway safety by integrating with existing CCTV cameras and utilizing machine learning (YOLOv8) to detect accidents in real-time. This system is dedicated to ensuring swift and efficient response to accidents, reducing the severity of incidents, and ultimately saving lives.

## ✨ Features

- **🤖 AI-Powered Detection**: YOLOv8 model analyzes live CCTV feeds to detect accidents with high accuracy
- **⚡ Real-time Alerts**: Instant notifications via WebSocket when accidents are detected
- **📱 Multi-channel Notifications**: Telegram and WhatsApp notifications with accident photos
- **📊 Interactive Dashboard**: Live monitoring, statistics, and accident history
- **🗺️ Google Maps Integration**: Visual accident locations and CCTV placements
- **🎯 Severity Classification**: Automatic classification of accident severity
- **📸 Snapshot Capture**: Automatic photo capture when accidents occur
- **🔔 Customizable Alerts**: Configure notification contacts per CCTV

## 🏗️ Architecture

**Hybrid Deployment:**
- **Frontend**: Next.js hosted on Vercel (Cloud)
- **Backend**: Flask AI + Socket.IO running on your laptop
- **Database**: PostgreSQL (Vercel Postgres)
- **Tunneling**: ngrok for exposing local backend

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture diagram.

## 🚀 Quick Start

### For Deployment (Production)

See detailed guides:
- **📘 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick deployment guide
- **📗 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment guide
- **✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

**TL;DR:**
```bash
# 1. Deploy frontend to Vercel
vercel --prod

# 2. Start backend on laptop
start-production.bat

# 3. Update Vercel with ngrok URLs
npm run update-vercel-env
```

### For Development (Local)

```bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Start development servers
npm run dev        # Next.js (port 3000)
npm run socket     # Socket.IO (port 4001)
python app.py      # Flask AI (port 5000)
```

- **Real-time Alerts**: Once an accident is detected, SENTRA immediately sends real-time alerts to the concerned authorities. These alerts include precise accident location data, allowing first responders to reach the scene quickly.

- **WhatsApp Notifications**: Integrated WhatsApp notification system sends urgent alerts with accident snapshots, GPS location links, and interactive response buttons to configured emergency contacts. See [WHATSAPP_NOTIFICATION.md](WHATSAPP_NOTIFICATION.md) for details.

- **Traffic Management**: SENTRA can provide real-time traffic data based on accident information. This can help authorities reroute traffic and minimize congestion caused by accidents, improving overall traffic flow.

- **Historical Data Analysis**: The system collects and stores historical accident data, which can be analyzed to identify accident-prone areas and patterns. This information can be used for future highway planning and safety improvements.

## How it Works

1. **Data Collection**: SENTRA collects live camera feed data from existing CCTV cameras on highways.

2. **Machine Learning Analysis**: Advanced machine learning algorithms analyze the camera feeds in real-time, looking for signs of accidents such as sudden stops, collisions, or debris on the road.

3. **Accident Detection**: When an accident is detected, SENTRA triggers alerts, including the accident location, to the concerned authorities and emergency services if configured.

4. **Data Storage and Analysis**: Historical accident data is stored for future analysis, aiding in long-term safety improvements.

## Benefits

- **Improved Response Time**: Swift detection and notification of accidents enable faster response times for first responders, potentially saving lives.

- **Reduced Severity**: By detecting accidents early, SENTRA can help reduce the severity of accidents and minimize damage and injuries.

- **Traffic Flow Improvement**: Real-time traffic information allows for better traffic management, reducing congestion and improving highway efficiency.

- **Data-Driven Safety**: Historical data analysis can lead to targeted safety improvements on highways, making them safer for all users.

## Challenges We Faced While Developing the Application
Certainly, here are the challenges faced during the development of the SENTRA system:

1. **Frame Capturing and Frequent POST Requests**:
   - Challenge: Managing the continuous capture of frames from CCTV cameras and executing POST requests for analysis in each frame presented a significant technical challenge. This process required efficient handling of a large volume of data and demanded real-time processing.
   
2. **Implementing Warning Audio on the Frontend**:
   - Challenge: Integrating warning audio signals on the frontend proved to be a complex task. Playing audio in response to accident detection required careful synchronization and user-friendly controls.
   
3. **Real-time Data Transmission via Socket.io**:
   - Challenge: Transmitting real-time accident data efficiently through Socket.io posed challenges, particularly when dealing with a large number of connected clients. Ensuring low latency and high reliability was crucial for instant updates.

To install and configure SENTRA, follow these steps:

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your machine.
- Python and pip (Python Package Manager) installed on your machine.
- Git installed on your machine.
- Access to the SENTRA GitHub repository.

### Installation Steps

1. **Clone the GitHub Repository**: Open your terminal and navigate to the directory where you want to install SENTRA. Then, clone the GitHub repository using the following command:

   ```bash
   git clone https://github.com/ABChapagain/SENTRA
   ```

  

2. **Navigate to the Project Directory**: Change your current directory to the cloned SENTRA repository:

   ```bash
   cd SENTRA
   ```

3. **Install npm Packages**: Run the following command to install the required Node.js packages using npm:

   ```bash
   npm install
   ```

4. **Install pip Packages**: SENTRA may require certain Python packages. To install these packages, create a virtual environment (recommended) and activate it. Then, use pip to install the required packages:

   ```bash
   # Create a virtual environment (optional but recommended)
   python -m venv venv

   # Activate the virtual environment (Windows)
   venv\Scripts\activate

   # Activate the virtual environment (macOS/Linux)
   source venv/bin/activate

   # Install Python packages
   pip install -r requirements.txt
   ```

5. **Configuration**: SENTRA may require configuration for your specific environment and CCTV camera setup. Refer to the project's documentation or configuration files to set up the system according to your needs.

6. **Build and Start the Server**: Once you have installed the npm packages and configured the system, you can build and start the server using the following command and run this command in a different terminal:

   ```bash
   python app.py
   npm run socket
   npm run dev
   ```

   This command will build the project and start the server.

7. **Adding CCTV Cameras**: Follow the instructions provided in the project documentation to add CCTV cameras and configure their integration with SENTRA.

8. **Tracking Accidents**: Once the system is up and running with your CCTV cameras integrated, SENTRA will automatically track and detect accidents as described in the project's features.

9. **Additional Configuration**: Depending on your specific use case, you may need to further configure the system for advanced features or customizations. Refer to the project's documentation for details.

10. **Testing**: Before deploying SENTRA in a production environment, it's advisable to thoroughly test its functionality and ensure that it meets your requirements.

Now, SENTRA should be up and running, integrated with your CCTV cameras, and capable of detecting accidents and performing other specified tasks. Be sure to consult the project's documentation and seek support from the project maintainers if you encounter any issues or have specific questions about its configuration and usage.

## Support and Contact

For any questions, support, or inquiries, please contact our team at [meprazhant@gmail.com](mailto:meprazhant@gmail.com), [achyutchapagain05@gmail.com](mailto:achyutchapagain05@gmail.com), [shameerkharel2@gmail.com](mailto:shameerkharel2@gmail.com), [rejensraya@gmail.com](mailto:rejensraya@gmail.com), [Noklent Fardian] (noklent320@gmail.com)

## License

SENTRA is released as an open-source collaboration and customization.

## Disclaimer

SENTRA is a tool designed to enhance highway safety, but it is not a replacement for responsible driving and existing safety measures. Always prioritize safe driving practices and follow local traffic laws when using the road.
