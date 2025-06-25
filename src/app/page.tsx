'use client';

import React, { useState } from 'react';
import styles from '../styles/page.module.css';
import Navbar from '../components/Navbar'; 

interface Horario {
  codigo: string;
  professor: string;
}

interface Materia {
  nome: string;
  sigla?: string;
  horarios: Horario[];
  cor: string;
}

interface Cell {
  materia?: string;
  cor?: string;
  codigo?: string;
}

const diasMapping: { [key: string]: number } = {
  '2': 0,
  '3': 1,
  '4': 2,
  '5': 3,
  '6': 4,
  '7': 5
};

const materiasPreDefinidas: Materia[] = [
  {
    nome: 'Linguagens de Programação',
    sigla: 'LP',
    horarios: [
      { codigo: '24M12', professor: 'Vander Ramos Alves' },
      { codigo: '46N12', professor: 'Marcelo Ladeira' },
      { codigo: '24M34', professor: 'Vander Ramos Alves' }
    ],
    cor: '#f39c12'
  },
  {
    nome: 'Engenharia de Software',
    sigla: 'ES',
    horarios: [
      { codigo: '24N34', professor: 'Fernando Antonio de Araujo Chacon de Albuquerque' },
      { codigo: '35M12', professor: 'Genaina Nunes Rodrigues' }
    ],
    cor: '#d35400'
  },
  {
    nome: 'Organização e Arquitetura de Computadores',
    sigla: 'OAC',
    horarios: [
      { codigo: '35M34', professor: 'Flavio de Barros Vidal' },
      { codigo: '24N12', professor: 'Carla Maria Chagas e Cavalcante Koike' }
    ],
    cor: '#2980b9'
  },
  {
    nome: 'Teleinformática e Redes 1',
    sigla: 'TR1',
    horarios: [
      { codigo: '35M12', professor: 'Marcelo Antonio Marotta' }
    ],
    cor: '#7f8c8d'
  },
  {
    nome: 'Eletromagnetismo 1',
    sigla: 'EM1',
    horarios: [
      { codigo: '46M34', professor: 'Achiles Fontana da Mota' }
    ],
    cor: '#34495e'
  },
  {
    nome: 'Sistemas Microprocessados',
    sigla: 'SM',
    horarios: [
      { codigo: '24M12', professor: 'Daniel Chaves Cafe' },
      { codigo: '35M34', professor: 'Daniel Chaves Cafe' }
    ],
    cor: '#9b59b6'
  },
  {
    nome: 'Laboratório de Sistemas Microprocessados',
    sigla: 'LSM',
    horarios: [
      { codigo: '3M34', professor: 'Jose Edil Guimaraes de Medeiros' },
      { codigo: '4M34', professor: 'Eduardo Bezerra Rufino Ferreira Paiva' },
      { codigo: '2M12', professor: 'Eduardo Bezerra Rufino Ferreira Paiva' }
    ],
    cor: '#16a085'
  }
];

const horariosUnB = [
  '08:00 - 08:55',
  '08:55 - 09:50',
  '10:00 - 10:55',
  '10:55 - 11:50',
  '12:00 - 12:55',
  '12:55 - 13:50',
  '14:00 - 14:55',
  '14:55 - 15:50',
  '16:00 - 16:55',
  '16:55 - 17:50',
  '19:00 - 19:55',
  '19:55 - 20:40',
  '21:00 - 21:45',
  '21:45 - 22:30'
];

const HomePage: React.FC = () => {
  const [grade, setGrade] = useState<Cell[][]>(
    Array(horariosUnB.length).fill(null).map(() => Array(6).fill({}))
  );

  let dragIcon: HTMLDivElement | null = null;

  const handleDragStart = (e: React.DragEvent, sigla: string, codigo: string, cor: string) => {
    e.dataTransfer.setData('sigla', sigla);
    e.dataTransfer.setData('codigo', codigo);
    e.dataTransfer.setData('cor', cor);

    dragIcon = document.createElement('div');
    dragIcon.style.width = '100px';
    dragIcon.style.height = '30px';
    dragIcon.style.backgroundColor = cor;
    dragIcon.style.color = '#fff';
    dragIcon.style.display = 'flex';
    dragIcon.style.alignItems = 'center';
    dragIcon.style.justifyContent = 'center';
    dragIcon.style.borderRadius = '8px';
    dragIcon.style.border = '1px solid #123163';
    dragIcon.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dragIcon.innerHTML = sigla;
    document.body.appendChild(dragIcon);

    e.dataTransfer.setDragImage(dragIcon, 50, 15);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const sigla = e.dataTransfer.getData('sigla');
    const codigo = e.dataTransfer.getData('codigo');
    const cor = e.dataTransfer.getData('cor');

    const horarios = decodeCodigo(codigo);

    if (horarios.every(({ row, col }) => grade[row]?.[col]?.materia === undefined)) {
      const newGrade = grade.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const horario = horarios.find(h => h.row === rIdx && h.col === cIdx);
          return horario ? { materia: sigla, codigo, cor } : cell;
        })
      );
      setGrade(newGrade);
    }
  };

  const handleCellClick = (materia: string, codigo: string) => {
    const newGrade = grade.map((row) =>
      row.map((cell) => {
        return cell.materia === materia && cell.codigo === codigo ? {} : cell;
      })
    );
    setGrade(newGrade);
  };

  const decodeCodigo = (codigo: string): { row: number, col: number }[] => {
    const result: { row: number, col: number }[] = [];

    const turnoBase: { [key: string]: number } = {
      M: 0,
      T: 5,
      N: 10
    };

    const partes = codigo.split(' ');

    partes.forEach(parte => {
      const match = parte.match(/^([2-7]+)([MTN])([0-9]+)$/);
      if (!match) return;

      const [, diasStr, turno, horariosStr] = match;
      const baseRow = turnoBase[turno];
      if (baseRow === undefined) return;

      const dias = diasStr.split('').map(d => diasMapping[d]);

      const blocos = new Set<number>();
      horariosStr.split('').forEach(h => {
        const num = parseInt(h);
        if (!isNaN(num)) {
          blocos.add(baseRow + ((num - 1)));
        }
      });

      dias.forEach(col => {
        blocos.forEach(row => {
          result.push({ row, col });
        });
      });
    });

    return result;
  };

  return (
  <>
    <Navbar
      limparGrade={() =>
        setGrade(Array(horariosUnB.length).fill(null).map(() => Array(6).fill({})))
      }
    />
    <div className={styles.container}>
      <div className={styles.containerGradeMateria}>
        <div className={styles.gradeContainer}>
          <p>Grade de Aulas</p>
          <table className={styles.grade}>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Segunda</th>
                <th>Terça</th>
                <th>Quarta</th>
                <th>Quinta</th>
                <th>Sexta</th>
                <th>Sábado</th>
              </tr>
            </thead>
            <tbody>
              {horariosUnB.map((horario, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{horario}</td>
                  {(grade[rowIndex] || []).map((cell: Cell, colIndex: number) => (
                    <td
                      key={colIndex}
                      className={styles.cell}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() =>
                        handleCellClick(cell.materia || '', cell.codigo || '')
                      }
                      style={{
                        backgroundColor: cell?.cor || '#f9f9f9',
                        color: cell?.cor ? 'white' : '#333',
                      }}
                    >
                      {cell?.materia || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.materiaList}>
          {materiasPreDefinidas.map((materia, idx) => (
            <div
              key={idx}
              className={styles.materiaCard}
              style={{ backgroundColor: materia.cor }}
            >
              <h3>{materia.nome}</h3>
              <ul>
                {materia.horarios.map((h, hIdx) => (
                  <li
                    key={hIdx}
                    className={styles.horarioItem}
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(
                        e,
                        materia.sigla || '',
                        h.codigo || '',
                        materia.cor || ''
                      )
                    }
                    onDragEnd={handleDragOver}
                  >
                    {h.codigo}
                    <span className={styles.professorHover}>{h.professor}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
}

export default HomePage;