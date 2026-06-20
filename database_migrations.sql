-- 0. Eliminar la tabla anterior (ATENCIÓN: Esto borra datos existentes en desarrollo)
drop table if exists public.inscripciones cascade;

-- 1. Crear la tabla de inscripciones
create table public.inscripciones (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfiles(id) on delete cascade not null,
  ruta_id bigint references public.rutas(id) on delete cascade not null,
  dni text, -- Obligatorio solo si solicita_federacion = true
  email_contacto text not null,
  telefono_contacto text not null,
  telefono_emergencias text not null,
  solicita_federacion boolean default false, -- Sí/No federación durante evento
  duracion_federacion integer, -- 2 o 7 días (calculado en backend/frontend)
  fecha_inscripcion timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Restricción: Un usuario solo puede apuntarse UNA vez a la misma ruta
  unique(usuario_id, ruta_id)
);

-- 2. Habilitar seguridad de filas (RLS)
alter table public.inscripciones enable row level security;

-- 3. Definir políticas de seguridad
create policy "Usuarios ven sus propias inscripciones" on public.inscripciones
  for select using (auth.uid() = usuario_id);

create policy "Usuarios pueden insertar sus propias inscripciones" on public.inscripciones
  for insert with check (auth.uid() = usuario_id);

create policy "Admins ven todas las inscripciones" on public.inscripciones
  for select using (auth.jwt() ->> 'email' in ('tu-email-admin@ejemplo.com')); -- Cambiar por tu email admin

-- TAREA CRÍTICA: Lógica de control de aforo (Máx 15 personas)
create or replace function check_aforo_antes_de_insert()
returns trigger as $$
begin
  if (
    select count(*)
    from public.inscripciones
    where ruta_id = new.ruta_id
  ) >= 15 then
    raise exception 'Aforo completo para esta ruta. Máximo 15 participantes.';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tr_check_aforo_inscripcion
  before insert on public.inscripciones
  for each row execute procedure check_aforo_antes_de_insert();
