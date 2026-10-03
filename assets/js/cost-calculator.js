/* ==========================================================================
   PROJECT SCOPE & COST ESTIMATOR WIDGET
   ========================================================================== */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const calcContainer = document.getElementById('calculator');
    if (!calcContainer) return;

    let state = {
      type: 1500,     // Default SaaS Web App
      typeName: 'SaaS Web Platform',
      scale: 1.2,     // Medium Enterprise
      scaleName: 'Medium Enterprise',
      aiAddon: 500,   // Included AI Agent
      aiName: 'Custom AI Chat / Bot',
      timeline: '3-5 Weeks'
    };

    const estimateValEl = document.getElementById('estimate-price');
    const estimateDetailsEl = document.getElementById('estimate-details');
    const applyBtn = document.getElementById('apply-estimate-btn');

    function recalculate() {
      const baseCost = state.type;
      const total = Math.round(baseCost * state.scale + state.aiAddon);
      const minVal = Math.round(total * 0.85);
      const maxVal = Math.round(total * 1.15);

      if (estimateValEl) {
        estimateValEl.textContent = `$${minVal.toLocaleString()} - $${maxVal.toLocaleString()}`;
      }
      if (estimateDetailsEl) {
        estimateDetailsEl.textContent = `${state.typeName} • ${state.scaleName} • ${state.aiName} (Est. ${state.timeline})`;
      }
    }

    // Bind option click handlers
    document.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const group = this.getAttribute('data-group');
        const cost = parseFloat(this.getAttribute('data-cost') || 0);
        const mult = parseFloat(this.getAttribute('data-mult') || 1);
        const name = this.getAttribute('data-name');
        const timeline = this.getAttribute('data-timeline');

        // Deselect others in group
        document.querySelectorAll(`.opt-btn[data-group="${group}"]`).forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');

        if (group === 'type') {
          state.type = cost;
          state.typeName = name;
        } else if (group === 'scale') {
          state.scale = mult;
          state.scaleName = name;
          if (timeline) state.timeline = timeline;
        } else if (group === 'ai') {
          state.aiAddon = cost;
          state.aiName = name;
        }

        if (window.SoundFX) window.SoundFX.click();
        recalculate();
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener('click', function () {
        if (window.SoundFX) window.SoundFX.success();
        const contactMessage = document.getElementById('message');
        const contactSection = document.getElementById('contact');
        
        if (contactMessage) {
          contactMessage.value = `Hi Ashutosh, I am interested in building a project with Ashutosh Software Services.\n\nProject Scope: ${state.typeName}\nScale: ${state.scaleName}\nAI Integration: ${state.aiName}\nEstimated Budget Range: ${estimateValEl.textContent}\nTimeline Goal: ${state.timeline}\n\nLet's connect!`;
        }
        
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }

        if (window.showToast) {
          window.showToast('Project estimate copied to contact form!');
        }
      });
    }

    recalculate();
  });
})();
