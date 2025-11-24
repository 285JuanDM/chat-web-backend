#!/usr/bin/env python3
"""
Script de Pruebas de Carga y Latencia para Chat App
Simula múltiples usuarios concurrentes y mide latencias
"""

import asyncio
import websockets
import requests
import json
import time
import statistics
from datetime import datetime
from typing import List, Dict
import random
import string

# ========== CONFIGURACIÓN ==========
API_URL = "http://localhost:3000"
WS_URL = "ws://localhost:3000"

NUM_USUARIOS = 100  # Número de usuarios concurrentes
NUM_MENSAJES_POR_USUARIO = 5  # Mensajes que enviará cada usuario
OBJETIVO_LATENCIA_MS = 850  # Latencia objetivo en ms

# ========== CLASE USUARIO SIMULADO ==========
class UsuarioSimulado:
    def __init__(self, id: int):
        self.id = id
        self.username = f"user_{id}"
        self.email = f"user_{id}@test.com"
        self.password = "test123"
        self.token = None
        self.ws = None
        self.latencias = []
        self.mensajes_enviados = 0
        self.mensajes_recibidos = 0
        
    async def registrar_y_login(self):
        """Registra e inicia sesión"""
        try:
            # Intentar registro
            response = requests.post(
                f"{API_URL}/auth/register",
                json={
                    "username": self.username,
                    "email": self.email,
                    "password": self.password
                },
                timeout=5
            )
            
            if response.status_code == 201:
                data = response.json()
                self.token = data.get("token")
                print(f"✅ Usuario {self.username} registrado")
                return True
            
            # Si falla el registro, intentar login
            response = requests.post(
                f"{API_URL}/auth/login",
                json={
                    "email": self.email,
                    "password": self.password
                },
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("token")
                print(f"✅ Usuario {self.username} logueado")
                return True
                
        except Exception as e:
            print(f"❌ Error login {self.username}: {e}")
            return False
    
    async def conectar_websocket(self):
        """Conecta al WebSocket"""
        try:
            self.ws = await websockets.connect(
                f"{WS_URL}?token={self.token}",
                ping_interval=20,
                ping_timeout=10
            )
            print(f"🔌 {self.username} conectado a WebSocket")
            return True
        except Exception as e:
            print(f"❌ Error WS {self.username}: {e}")
            return False
    
    async def unirse_sala(self, room_id: str):
        try:
            response = requests.post(
                f"{API_URL}/rooms/{room_id}/join",
                headers={"Authorization": f"Bearer {self.token}"},
                timeout=5
            )

            if response.status_code != 200:
                print(f"❌ {self.username} NO pudo unirse: {response.status_code} -> {response.text}")
                return False
            
            await self.ws.send(json.dumps({
                "event": "join_room",
                "data": {"roomId": room_id}
            }))
            
            print(f"🚪 {self.username} se unió a la sala")
            return True

        except Exception as e:
            print(f"❌ Error join {self.username}: {e}")
            return False
    
    async def enviar_mensaje(self, room_id: str, contenido: str):
        """Envía un mensaje y mide latencia"""
        try:
            tiempo_inicio = time.time()
            
            # Enviar mensaje por WebSocket
            await self.ws.send(json.dumps({
                "event": "send_message",
                "data": {
                    "roomId": room_id,
                    "content": contenido
                }
            }))
            
            self.mensajes_enviados += 1
            
            # Esperar confirmación (timeout 2 segundos)
            try:
                respuesta = await asyncio.wait_for(
                    self.ws.recv(),
                    timeout=2.0
                )
                
                tiempo_fin = time.time()
                latencia_ms = (tiempo_fin - tiempo_inicio) * 1000
                self.latencias.append(latencia_ms)
                self.mensajes_recibidos += 1
                
                return latencia_ms
                
            except asyncio.TimeoutError:
                print(f"⏱️ Timeout esperando respuesta de {self.username}")
                return None
                
        except Exception as e:
            print(f"❌ Error enviando mensaje {self.username}: {e}")
            return None
    
    async def cerrar(self):
        """Cierra la conexión WebSocket"""
        if self.ws:
            await self.ws.close()


# ========== FUNCIONES DE PRUEBA ==========

async def crear_sala_prueba():
    """Crea una sala para las pruebas"""
    try:
        # Crear usuario admin temporal
        admin = UsuarioSimulado(0)
        await admin.registrar_y_login()
        
        response = requests.post(
            f"{API_URL}/rooms",
            headers={"Authorization": f"Bearer {admin.token}"},
            json={"name": f"Test_{int(time.time())}", "isPrivate": False},
            timeout=5
        )
        
        if response.status_code == 200:
            room_id = response.json().get("id")
            print(f"🏠 Sala de prueba creada: {room_id}")
            return room_id
        else:
            print(f"❌ Error creando sala: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error en crear_sala_prueba: {e}")
        return None


async def prueba_usuario(usuario: UsuarioSimulado, room_id: str, num_mensajes: int):
    """Ejecuta la prueba para un usuario"""
    try:
        # 1. Registrar y login
        if not await usuario.registrar_y_login():
            return None
        
        # 2. Conectar WebSocket
        if not await usuario.conectar_websocket():
            return None
        
        # Pequeño delay para evitar race conditions
        await asyncio.sleep(random.uniform(0.1, 0.5))
        
        # 3. Unirse a la sala
        if not await usuario.unirse_sala(room_id):
            return None
        
        await asyncio.sleep(0.5)
        
        # 4. Enviar mensajes
        for i in range(num_mensajes):
            contenido = f"Mensaje {i+1} de {usuario.username}"
            latencia = await usuario.enviar_mensaje(room_id, contenido)
            
            if latencia:
                simbolo = "✅" if latencia < OBJETIVO_LATENCIA_MS else "⚠️"
                print(f"{simbolo} {usuario.username}: {latencia:.2f}ms")
            
            # Delay entre mensajes
            await asyncio.sleep(random.uniform(0.5, 1.5))
        
        # 5. Cerrar conexión
        await usuario.cerrar()
        
        return usuario
        
    except Exception as e:
        print(f"❌ Error en prueba de {usuario.username}: {e}")
        return None


async def ejecutar_pruebas():
    """Ejecuta todas las pruebas"""
    print("="*60)
    print("🧪 INICIANDO PRUEBAS DE CARGA Y LATENCIA")
    print("="*60)
    print(f"📊 Configuración:")
    print(f"   - Usuarios concurrentes: {NUM_USUARIOS}")
    print(f"   - Mensajes por usuario: {NUM_MENSAJES_POR_USUARIO}")
    print(f"   - Objetivo de latencia: < {OBJETIVO_LATENCIA_MS}ms")
    print("="*60)
    
    # Crear sala de prueba
    room_id = await crear_sala_prueba()
    if not room_id:
        print("❌ No se pudo crear sala de prueba")
        return
    
    print(f"\n⏳ Iniciando simulación de {NUM_USUARIOS} usuarios...\n")
    
    # Crear usuarios
    usuarios = [UsuarioSimulado(i+1) for i in range(NUM_USUARIOS)]
    
    # Ejecutar pruebas en paralelo
    tiempo_inicio = time.time()
    
    tareas = [
        prueba_usuario(usuario, room_id, NUM_MENSAJES_POR_USUARIO)
        for usuario in usuarios
    ]
    
    resultados = await asyncio.gather(*tareas, return_exceptions=True)
    
    tiempo_total = time.time() - tiempo_inicio
    
    # Procesar resultados
    usuarios_exitosos = [u for u in resultados if isinstance(u, UsuarioSimulado)]
    
    print("\n" + "="*60)
    print("📈 RESULTADOS DE LA PRUEBA")
    print("="*60)
    
    # Estadísticas generales
    print(f"\n✅ Usuarios completados: {len(usuarios_exitosos)}/{NUM_USUARIOS}")
    print(f"⏱️  Tiempo total: {tiempo_total:.2f}s")
    
    # Recolectar todas las latencias
    todas_latencias = []
    total_mensajes_enviados = 0
    total_mensajes_recibidos = 0
    
    for usuario in usuarios_exitosos:
        todas_latencias.extend(usuario.latencias)
        total_mensajes_enviados += usuario.mensajes_enviados
        total_mensajes_recibidos += usuario.mensajes_recibidos
    
    print(f"📨 Mensajes enviados: {total_mensajes_enviados}")
    print(f"📬 Mensajes recibidos: {total_mensajes_recibidos}")
    print(f"📊 Tasa de éxito: {(total_mensajes_recibidos/total_mensajes_enviados*100):.1f}%")
    
    # Estadísticas de latencia
    if todas_latencias:
        print(f"\n📊 ESTADÍSTICAS DE LATENCIA:")
        print(f"   - Mínima: {min(todas_latencias):.2f}ms")
        print(f"   - Máxima: {max(todas_latencias):.2f}ms")
        print(f"   - Promedio: {statistics.mean(todas_latencias):.2f}ms")
        print(f"   - Mediana: {statistics.median(todas_latencias):.2f}ms")
        
        if len(todas_latencias) > 1:
            print(f"   - Desv. estándar: {statistics.stdev(todas_latencias):.2f}ms")
        
        # Verificar objetivo
        latencias_ok = [l for l in todas_latencias if l < OBJETIVO_LATENCIA_MS]
        porcentaje_ok = (len(latencias_ok) / len(todas_latencias)) * 100
        
        print(f"\n🎯 CUMPLIMIENTO DEL OBJETIVO (< {OBJETIVO_LATENCIA_MS}ms):")
        print(f"   {len(latencias_ok)}/{len(todas_latencias)} mensajes ({porcentaje_ok:.1f}%)")
        
        if porcentaje_ok >= 95:
            print("   ✅ APROBADO - Más del 95% cumple el objetivo")
        elif porcentaje_ok >= 80:
            print("   ⚠️  ADVERTENCIA - Entre 80-95% cumple el objetivo")
        else:
            print("   ❌ FALLO - Menos del 80% cumple el objetivo")
    
    # Throughput
    if tiempo_total > 0:
        throughput = total_mensajes_recibidos / tiempo_total
        print(f"\n⚡ Throughput: {throughput:.2f} mensajes/segundo")
    
    print("\n" + "="*60)
    print("✅ PRUEBA COMPLETADA")
    print("="*60)


# ========== PRUEBAS ADICIONALES ==========

async def prueba_conexiones_simultaneas():
    """Prueba solo conexiones simultáneas sin enviar mensajes"""
    print("\n🧪 Prueba de conexiones simultáneas...")
    
    usuarios = []
    for i in range(NUM_USUARIOS):
        usuario = UsuarioSimulado(i+1)
        if await usuario.registrar_y_login():
            if await usuario.conectar_websocket():
                usuarios.append(usuario)
    
    print(f"✅ Conexiones simultáneas exitosas: {len(usuarios)}/{NUM_USUARIOS}")
    
    # Cerrar todas
    for usuario in usuarios:
        await usuario.cerrar()


# ========== MAIN ==========

def main():
    """Función principal"""
    print("\n🚀 Script de Pruebas de Carga - Chat App")
    print("Presiona Ctrl+C para cancelar\n")
    
    try:
        # Verificar que el servidor esté corriendo
        try:
            response = requests.get(f"{API_URL}/", timeout=5)
        except:
            print("❌ ERROR: No se puede conectar al servidor")
            print(f"   Asegúrate que el backend esté corriendo en {API_URL}")
            return
        
        # Ejecutar pruebas
        asyncio.run(ejecutar_pruebas())
        
    except KeyboardInterrupt:
        print("\n\n⚠️  Prueba cancelada por el usuario")
    except Exception as e:
        print(f"\n❌ Error fatal: {e}")


if __name__ == "__main__":
    main()
