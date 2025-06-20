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
  '6': 4
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
    nome: 'Organização e Arquitetura de Computadores',
    sigla: 'OAC',
    horarios: [
      { codigo: '24T23', professor: 'Marcus Vinicius Lamar' },
      { codigo: '35T23', professor: 'Ricardo Pezzuol Jacobi' },
      { codigo: '35M34', professor: 'Flavio de Barros Vidal' },
      { codigo: '24N12', professor: 'Carla Maria Chagas e Cavalcante Koike' }
    ],
    cor: '#2980b9'
  },
  {
    nome: 'Cálculo Numérico',
    sigla: 'CN',
    horarios: [
      { codigo: '24M34', professor: 'A definir docente' },
      { codigo: '35T45', professor: 'Flavia Ferreira Ramos Zapata' },
      { codigo: '35T23', professor: 'Flavia Ferreira Ramos Zapata' },
      { codigo: '24M12', professor: 'Raderson Rodrigues da Silva' },
      { codigo: '35T23', professor: 'Carlos Maber Carrion Riveros' }
    ],
    cor: '#8e44ad'
  },
  {
    nome: 'Sistemas Digitais',
    sigla: 'SD',
    horarios: [
      { codigo: '35T45', professor: 'Edson Mitsu Hung' },
      { codigo: '24M34', professor: 'A definir docente' },
      { codigo: '24T45', professor: 'Joao Luiz Azevedo de Carvalho' }
    ],
    cor: '#e74c3c'
  },
  {
    nome: 'Laboratório de Sistemas Digitais',
    sigla: 'LSD',
    horarios: [
      { codigo: '2M34', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '2T23', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '3T45', professor: 'Jose Edil Guimaraes de Medeiros' },
      { codigo: '6M12', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '6M34', professor: 'Luis Fernando Ramos Molinaro' },
      { codigo: '3T23', professor: 'Jose Edil Guimaraes de Medeiros' },
      { codigo: '6T45', professor: 'Eduardo Bezerra Rufino Ferreira Paiva' },
      { codigo: '6T23', professor: 'Eduardo Bezerra Rufino Ferreira Paiva' }
    ],
    cor: '#16a085'
  },
  {
    nome: 'Eletromagnetismo 1',
    sigla: 'EM1',
    horarios: [
      { codigo: '35T45', professor: 'Adoniran Judson de Barros Braga' },
      { codigo: '46M34', professor: 'Achiles Fontana da Mota' }
    ],
    cor: '#34495e'
  },
  {
    nome: 'Sinais e Sistemas em Tempo Discreto',
    sigla: 'SSTD',
    horarios: [
      { codigo: '35M12', professor: 'Hugo Tadashi Muniz Kussaba' },
      { codigo: '24T23', professor: 'Francisco Assis de Oliveira Nascimento' },
      { codigo: '35M34', professor: 'Eduardo Peixoto Fernandes da Silva' },
      { codigo: '35T6 35N1', professor: 'Robson Domingos Vieira' }
    ],
    cor: '#27ae60'
  }
];

const HomePage: React.FC = () => {
  const [grade, setGrade] = useState<Cell[][]>(Array(7).fill('').map(() => Array(5).fill({})));
  let dragIcon: HTMLDivElement | null = null;

  const handleDragStart = (e: React.DragEvent, sigla: string, codigo: string, cor: string) => {
    e.dataTransfer.setData('sigla', sigla); // Passa a sigla ao invés do nome completo
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
    dragIcon.innerHTML = sigla; // Exibe a sigla no ícone de arraste
    document.body.appendChild(dragIcon);
  
    e.dataTransfer.setDragImage(dragIcon, 50, 15);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const sigla = e.dataTransfer.getData('sigla'); // Pegamos a sigla
    const codigo = e.dataTransfer.getData('codigo');
    const cor = e.dataTransfer.getData('cor'); 
  
    const horarios = decodeCodigo(codigo);
  
    if (horarios.every(({ row, col }) => grade[row]?.[col]?.materia === undefined)) {
      const newGrade = grade.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const horario = horarios.find(h => h.row === rIdx && h.col === cIdx);
          return horario ? { materia: sigla, codigo, cor } : cell; // Aqui exibimos a sigla
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
  
    // Quebra o código em partes separadas, por exemplo, "2M1234 4M12" vira ["2M1234", "4M12"]
    const partes = codigo.split(' ');
  
    partes.forEach((parte) => {
      const regex = /(\d+)([MTN])(\d+)/; // Ex: 24M12 ou 35T34
      const match = parte.match(regex);
  
      if (!match) {
        return;
      }
  
      const dias = match[1].split(''); // Pega os dias (ex.: 24 se transforma em ['2', '4'])
      const periodo = match[2]; // M (manhã), T (tarde), N (noite)
      const horarios = match[3]; // Ex.: 12 (primeiro e segundo horário)
  
      // Determina as linhas baseadas no período e horário
      let linhas: number[];
      if (horarios === '12') {
        linhas = periodo === 'M' ? [0] : periodo === 'T' ? [2] : periodo === 'N' ? [5] : []; // Manhã 1º horário ou Tarde 1º ou Noite 1º
      } else if (horarios === '34') {
        linhas = periodo === 'M' ? [1] : periodo === 'T' ? [3] : periodo === 'N' ? [6] : []; // Manhã 2º horário ou Tarde 2º ou Noite 2º
      } else if (horarios === '1234') {
        linhas = periodo === 'M' ? [0, 1] : periodo === 'T' ? [2, 3] : periodo === 'N' ? [5, 6] : []; // Ambos horários
      } else if (horarios === '1') {
        linhas = [2]; // Primeiro horário da tarde (12:00 - 13:50)
      } else if (horarios === '23') {
        linhas = [3]; // Segundo horário da tarde (14:00 - 15:50)
      } else if (horarios === '45') {
        linhas = [4]; // Terceiro horário da tarde (16:00 - 17:50)
      } else {
        return; // Código inválido
      }
  
      const diasColunas = dias.map(dia => diasMapping[dia]); // Transforma o dia em coluna
  
      // Para cada combinação de dia e linha, adiciona ao resultado
      for (const linha of linhas) {
        for (const coluna of diasColunas) {
          result.push({ row: linha, col: coluna });
        }
      }
    });
  
    return result;
  };

  return (
    <>
      <Navbar 
        limparGrade={() => setGrade(Array(7).fill('').map(() => Array(5).fill({})))} 
        salvarGrade={() => console.log('Grade salva!')} 
      />
  
      <div className={styles.container}>
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
              </tr>
            </thead>
            <tbody>
              {['08:00 - 09:50', '10:00 - 11:50', '12:00 - 13:50', '14:00 - 15:50', '16:00 - 17:50', '19:00 - 20:40', '20:50 - 22:30'].map(
                (horario, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{horario}</td>
                    {grade[rowIndex].map((cell: Cell, colIndex: number) => (
                      <td
                        key={colIndex}
                        className={styles.cell}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => handleCellClick(cell.materia || '', cell.codigo || '')}
                        style={{ backgroundColor: cell?.cor || '#f9f9f9', color: cell?.cor ? 'white' : '#333' }}
                      >
                        {cell?.materia || ''}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.materiaList}>
          {materiasPreDefinidas.map((materia, idx) => (
            <div key={idx} className={styles.materiaCard} style={{ backgroundColor: materia.cor }}>
              <h3>{materia.nome}</h3>
              <ul>
              {materia.horarios.map((h, hIdx) => (
                <li
                  key={hIdx}
                  className={styles.horarioItem}
                  draggable
                  onDragStart={(e) => handleDragStart(e, materia.sigla || '', h.codigo || '', materia.cor || '')}
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
    </>
  );
};

export default HomePage;