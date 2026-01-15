# 🏥 Clinic Booking

Un’applicazione **full-stack** per la gestione delle prenotazioni in ambito sanitario.  
Il sistema consente di gestire **utenti, medici e appuntamenti**, con interfaccia moderna.  
Il progetto è stato interamente containerizzato con **Docker**, per eseguire facilmente frontend, backend e database in ambiente isolato.

---

## 🚀 Stack Tecnologico

### 🌐 Frontend
- **React.js** con gestione tema **Light/Dark**
- Componenti riutilizzabili e design responsive
- Integrazione con API REST tramite `fetch` o `axios`
- Salvataggio preferenze tema in `localStorage`
- Dashboard con riepilogo utenti, medici e prenotazioni

### ⚙️ Backend
- **Spring Boot** (Java 17)
- API REST per utenti, medici e prenotazioni
- Validazione dati con **Spring Validation**
- Documentazione automatica con **Swagger UI**
- Persistenza con **Spring Data JPA**

### 🗄️ Database
- **PostgreSQL** (gestito tramite Docker)
- Struttura relazionale con chiavi esterne per utenti, medici e prenotazioni

---

## 🧩 Architettura del Progetto

    clinic-booking/

    ├── backend/ → API REST Spring Boot

    ├── frontend/ → Applicazione React

    ├── docs/ → Documentazione e diagrammi

    ├── docker-compose.yml

    └── README.md


## 🐳 Deploy con Docker

Il progetto è completamente containerizzato tramite **Docker Compose**.  
Per avviare tutto l’ambiente (backend + frontend + database), esegui:


docker-compose up --build
🌍 Servizi disponibili
Frontend → http://localhost:3000

Backend → http://localhost:8080

Database → localhost:5432 (utente: postgres, password: postgres)


##  📋 Funzionalità Principali

✅ CRUD completo per:

Utenti (creazione, modifica, eliminazione)

Medici (anagrafica e specializzazione)

Prenotazioni (stato: “In attesa”, “Completata”, “Cancellata”)

✅ Dashboard di riepilogo

✅ Interfaccia con badge colorati per lo stato prenotazione

✅ Tema dinamico (chiaro/scuro)

✅ Integrazione backend–frontend tramite REST API

## 🧠 Documentazione API (Swagger)

Swagger UI è disponibile all’indirizzo:
👉 http://localhost:8080/swagger-ui/index.html

## 🧱 Struttura dei Container
Ogni servizio è containerizzato tramite Docker:

      Servizio 	        Porta locale	      Docker Image
      PostgreSQL	        5432	           postgres:15
      Backend API	        8080	        clinic-booking-backend
      Frontend	            3000	        clinic-booking-frontend

