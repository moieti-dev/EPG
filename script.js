document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fitness-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progress = document.getElementById('progress');

    let currentStep = 0;

    function updateProgress() {
        if (!progress) return;
        const totalSteps = steps.length - 1; 
        const percent = (currentStep / (totalSteps - 1)) * 100;
        progress.style.width = Math.min(percent, 100) + '%';
    }

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === index);
        });
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateStep(index) {
        const activeStep = steps[index];
        const inputs = activeStep.querySelectorAll('input[required]');
        let valid = true;

        inputs.forEach(input => {
            if (!input.value) {
                valid = false;
                input.style.borderBottomColor = 'red';
            } else {
                input.style.borderBottomColor = '';
            }
        });

        return valid;
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnSubmit = form.querySelector('.btn-submit');
        const originalBtnText = btnSubmit.textContent;
        btnSubmit.textContent = 'ENVIANDO...';
        btnSubmit.disabled = true;

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                currentStep = steps.length - 1;
                showStep(currentStep);
                document.querySelector('.progress-container').style.display = 'none';
            } else {
                alert("ERROR AL ENVIAR.");
                btnSubmit.textContent = originalBtnText;
                btnSubmit.disabled = false;
            }
        } catch (error) {
            alert("ERROR DE CONEXIÓN.");
            btnSubmit.textContent = originalBtnText;
            btnSubmit.disabled = false;
        }
    });

    updateProgress();
});
