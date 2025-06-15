
from flask import Flask, render_template, request, redirect, url_for, session
import json
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

# Load data from JSON files
with open('learners.json') as f:
    learners = json.load(f)

with open('teachers.json') as f:
    teachers = json.load(f)

with open('assessment_types.json') as f:
    assessment_types = json.load(f)

with open('areas_of_focus.json') as f:
    areas_of_focus = json.load(f)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        teacher = next((t for t in teachers if t['email'] == email), None)
        if teacher and check_password_hash(teacher['password'], password):
            session['teacher_id'] = teacher['name']
            return redirect(url_for('dashboard'))
        else:
            return 'Invalid credentials'
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'teacher_id' in session:
        stats_by_classes = {
            'Term 1': {'Visual': 0, 'Auditory': 0, 'Kinesthetic': 0},
            'Term 2': {'Visual': 0, Auditory: 0, Kinesthetic: 0},
            Term 3: {Visual: 0, Auditory: 0, Kinesthetic: 0},
            Term 4: {Visual: 0, Auditory: 0, Kinesthetic: 0}
        }
        
        for learner in learners:
            for i in range(4):
                if learner['assessment_scores'][i] >= 75:
                    stats_by_classes[f'Term {i+1}'][learner['learning_style']] += 1
        
        return render_template('dashboard.html', stats_by_classes=stats_by_classes)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
