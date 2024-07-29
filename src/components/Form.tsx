import {categories} from '../data/categories'
import {v4 as uuidv4} from 'uuid'
import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from 'react'
import { Activity } from '../types'
import { ActivityActions, ActivityState } from '../reducers/activityReducer'

type FormProps = {
    dispatch: Dispatch<ActivityActions>,
    state: ActivityState
}

const initialState : Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}


export default function Form({dispatch, state} : FormProps) {

    const [activity, setActivity] = useState<Activity>(initialState)

    useEffect(()=> {
            if(state.activeId){
                const selectActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId)[0]
                setActivity(selectActivity)
            }
    }, [state.activeId])


    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const isNumberField = ['category', 'calories'].includes(e.target.id)

        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })
    }

    const isValidActivity = () => {
            const {name,calories} = activity

            return name.trim() !== '' && calories > 0
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        dispatch({type: 'save-activity', payload: {newActivity: activity}})

        setActivity({
            ...initialState,
            id: uuidv4()
        })
    }

  return (
  
    <form  className="space-y-5 bg-white shadow-md p-10 rounded-lg" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="category" className='font-bold'>Categoria:</label>
            <select
             name="" 
             id="category" 
             className="border border-slate-300 p-2 rounded-lg w-full bg-white" value={activity.category}
             onChange={handleChange}
             >

            {categories.map((category)=>(
                <option 
                value={category.id}
                key={category.id}
                >{category.name}</option>
            ))}

            </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
        <label htmlFor="name" className='font-bold'>Actividad:</label>
            <input type="text" id='name' className='border border-slate-300 p-2 rounded-lg' placeholder='Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta ' value={activity.name}              onChange={handleChange}
            />

        </div>

        <div className="grid grid-cols-1 gap-3">
        <label htmlFor="calories" className='font-bold'>Calorias:</label>
            <input type="number" id='calories' className='border border-slate-300 p-2 rounded-lg' placeholder='Calorias Ej. 300 o 500 ' min={0} value={activity.calories}              
            onChange={handleChange}
 />

        </div>

        <input type="submit"  className='bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white hover:cursor-pointer disabled:opacity-10 disabled:cursor-not-allowed' value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio' } disabled={!isValidActivity()}/>

    </form>
  )
}