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

const HomePage: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([]); // Inicializa como vazio para matérias dinâmicas
  const [newMateria, setNewMateria] = useState<Materia>({
    nome: '',
    horarios: [{ codigo: '', professor: '' }],
    cor: '#000000'
  });

  const [grade, setGrade] = useState<Cell[][]>(Array(7).fill('').map(() => Array(5).fill({})));
  let dragIcon: HTMLDivElement | null = null;

  // Função para capturar as mudanças no formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    if (name === 'codigo' || name === 'professor') {
      const updatedHorarios = [...newMateria.horarios];
      updatedHorarios[index] = { ...updatedHorarios[index], [name]: value };
      setNewMateria({ ...newMateria, horarios: updatedHorarios });
    } else {
      setNewMateria({ ...newMateria, [name]: value });
    }
  };

  const handleAddHorario = () => {
    setNewMateria({
      ...newMateria,
      horarios: [...newMateria.horarios, { codigo: '', professor: '' }]
    });
  };

  const handleAddMateria = () => {
    setMaterias([...materias, newMateria]);
    setNewMateria({
      nome: '',
      horarios: [{ codigo: '', professor: '' }],
      cor: '#000000'
    });
  };

  const handleDragStart = (e: React.DragEvent, materia: string, codigo: string, cor: string) => {
    e.dataTransfer.setData('materia', materia);
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
    dragIcon.innerHTML = codigo;
    document.body.appendChild(dragIcon);

    e.dataTransfer.setDragImage(dragIcon, 50, 15);
  };

  const handleDragEnd = () => {
    if (dragIcon) {
      document.body.removeChild(dragIcon);
      dragIcon = null;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const materia = e.dataTransfer.getData('materia');
    const codigo = e.dataTransfer.getData('codigo');
    const cor = e.dataTransfer.getData('cor'); 

    const horarios = decodeCodigo(codigo);
    
    if (horarios.every(({ row, col }) => grade[row]?.[col]?.materia === undefined)) {
      const newGrade = grade.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const horario = horarios.find(h => h.row === rIdx && h.col === cIdx);
          return horario ? { materia, codigo, cor } : cell;
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

    const partes = codigo.split(' ');

    partes.forEach((parte) => {
      const regex = /(\d+)([MTN])(\d+)/;
      const match = parte.match(regex);

      if (!match) {
        return;
      }

      const dias = match[1].split('');
      const periodo = match[2];
      const horarios = match[3];

      let linhas: number[];
      if (horarios === '12') {
        linhas = periodo === 'M' ? [0] : periodo === 'T' ? [2] : [4];
      } else if (horarios === '34') {
        linhas = periodo === 'M' ? [1] : periodo === 'T' ? [3] : [5];
      } else if (horarios === '1234') {
        linhas = periodo === 'M' ? [0, 1] : periodo === 'T' ? [2, 3] : [4, 5];
      } else if (horarios === '1') {
        linhas = [2];
      } else if (horarios === '23') {
        linhas = [3];
      } else if (horarios === '45') {
        linhas = [4];
      } else {
        return;
      }

      const diasColunas = dias.map(dia => diasMapping[dia]);

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
        <div className={styles.formAndMateria}>
          <div className={styles.formContainer}>
            <h2>Adicionar Nova Matéria</h2>
            <input
              type="text"
              name="nome"
              value={newMateria.nome}
              placeholder="Nome da Matéria"
              onChange={(e) => handleInputChange(e, -1)}
            />
            {newMateria.horarios.map((horario, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="codigo"
                  value={horario.codigo}
                  placeholder="Código do Horário"
                  onChange={(e) => handleInputChange(e, index)}
                />
                <input
                  type="text"
                  name="professor"
                  value={horario.professor}
                  placeholder="Nome do Professor"
                  onChange={(e) => handleInputChange(e, index)}
                />
              </div>
            ))}
            <button onClick={handleAddHorario}>Adicionar Horário</button>
            <input
              type="color"
              name="cor"
              value={newMateria.cor}
              onChange={(e) => handleInputChange(e, -1)}
            />
            <button onClick={handleAddMateria}>Adicionar Matéria</button>
          </div>
          <div className={styles.materiaList}>
            {materias.map((materia, idx) => (
              <div key={idx} className={styles.materiaCard} style={{ backgroundColor: materia.cor }}>
                <h3>{materia.nome}</h3>
                <ul>
                  {materia.horarios.map((h, hIdx) => (
                    <li
                      key={hIdx}
                      className={styles.horarioItem}
                      draggable
                      onDragStart={(e) => handleDragStart(e, materia.nome, h.codigo, materia.cor)}
                      onDragEnd={handleDragEnd} 
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