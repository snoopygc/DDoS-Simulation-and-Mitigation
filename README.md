# 🛡️ DDoS Attack Simulator

**Description:**

An interactive web-based platform designed to promote cybersecurity knowledge through real-time DDoS attack simulation and mitigation strategy demonstration. The application provides a controlled educational environment for understanding attack vectors, defense mechanisms, and emergency response procedures used in production systems.

**Highlights:**

- Implements four realistic attack types (HTTP Flood, SYN Flood, UDP Flood, Slowloris) with adjustable intensity controls and detailed educational tooltips explaining attack characteristics, severity levels, and real-world impact scenarios.

- Provides comprehensive mitigation strategies including rate limiting, IP filtering, CAPTCHA challenges, traffic analysis, and load balancing, with real-time effectiveness tracking and automatic health recovery when protection exceeds 70%.

- Features emergency response mechanisms simulating real-world procedures: DDoS Protection Service activation (traffic scrubbing), Failover to Backup Servers (redundant infrastructure), and Emergency Scaling (dynamic resource allocation), each with realistic 30-second deployment cooldowns.

- Delivers interactive visualizations using Recharts for traffic monitoring, Canvas API for animated network topology with particle effects, and real-time metrics tracking server health, request rates, and attack patterns.

- Tracks comprehensive analytics including attack history logs, session statistics (total attacks, block rate, uptime percentage, average response time), and educational content with severity indicators and complexity ratings.

- Built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS v4, demonstrating modern full-stack development practices, real-time state management, and accessible UI design with Radix UI primitives.
