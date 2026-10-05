/* ==========================================================================
   INTERACTIVE DEVELOPER TERMINAL (`ashutosh-services-cli`)
   ========================================================================== */

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    if (!terminalBody || !terminalInput) return;

    const commands = {
      help: function () {
        return `Available commands:
  <span class="kw">founder</span>    - Ashutosh Software Services Details (Est. 01/04/2024)
  <span class="kw">engineer</span>   - 4 Years Software Engineering Background & Experience
  <span class="kw">services</span>   - Software Suite (HIMS, School, Clinic Systems, Personal Websites)
  <span class="kw">skills</span>     - Technical Tech Stack (C#, ASP.NET, MVC Core, Oracle, SQL, etc.)
  <span class="kw">contact</span>    - Official Phone (9702458473) & Email (ashutoshsoftwareservices@gmail.com)
  <span class="kw">clear</span>      - Clear terminal screen`;
      },
      founder: function () {
        return `[ASHUTOSH SOFTWARE SERVICES]
Company Founded : April 1, 2024 (01/04/2024)
Core Mission    : Delivering high-performance customized Web-Based Software.
Phone / WhatsApp: +91 9702458473
Official Email  : ashutoshsoftwareservices@gmail.com
Product Suite   :
 - HIMS (Hospital Information Management System)
 - Clinic Management System (Appointments, EMR, Billing)
 - School & College Management Systems
 - Personal Websites (Static & Dynamic)`;
      },
      engineer: function () {
        return `[SOFTWARE ENGINEER PROFILE]
Experience  : 4 Years of Industry Work Experience
Core Stack  : C#, ASP.NET, .NET MVC Core, Oracle Database, SQL Server, HTML5, CSS3, JavaScript, Bootstrap
Focus       : Enterprise Web Architecture, High-Concurrency Database Design & Healthcare Software Systems`;
      },
      /*
      lims: function () {
        return `[LIMS TESTING LAB SOFTWARE]
Scope       : Web LIMS for ANY Type of Testing Lab (Medical Diagnostic & Mechanical/Industrial Testing).
Mechanical  : Tensile Testing, Hardness, Physical & Chemical Material Analysis software.
Medical     : Pathology, Diagnostic reporting, Automated barcodes & Patient portals.`;
      },
      */
      services: function () {
        return `[SOFTWARE OFFERINGS CATALOG]
1. HIMS (Hospital Information Management System)
2. Clinic Management System (EMR, Prescriptions, Appointments)
3. School Management System (Admissions, Fee Collection, Marksheets)
4. Personal Websites (Static & Dynamic design & CMS)
5. Customized Business Automation Software`;
      },
      skills: function () {
        return `[TECHNICAL TECH STACK]
Languages  : C#, SQL, JavaScript (ES6+), HTML5, CSS3
Frameworks : ASP.NET, .NET MVC CORE, Bootstrap UI
Databases  : Oracle Database, Microsoft SQL Server, Stored Procedures
Tools & Ops: IIS, Visual Studio, Git, RESTful Web APIs`;
      },
      contact: function () {
        return `[OFFICIAL CONTACT CHANNELS]
Phone / WA : +91 97024 58473
Email      : ashutoshsoftwareservices@gmail.com
Company    : Ashutosh Software Services (Est. 01/04/2024)
Status     : Available for custom web software development & lab software consulting.`;
      },
      clear: function () {
        terminalBody.innerHTML = '';
        return null;
      }
    };

    function appendOutput(cmdText, outputHtml) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = `<span class="terminal-prompt">ashutosh@services:~$</span> ${escapeHtml(cmdText)}`;
      terminalBody.appendChild(line);

      if (outputHtml !== null) {
        const outDiv = document.createElement('div');
        outDiv.className = 'terminal-line terminal-output';
        outDiv.innerHTML = outputHtml;
        terminalBody.appendChild(outDiv);
      }

      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function escapeHtml(text) {
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Quick Command Pills Click Handler
    const pillBtns = document.querySelectorAll('.term-pill-btn');
    pillBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const cmd = this.getAttribute('data-cmd');
        if (cmd && commands[cmd]) {
          if (window.SoundFX) window.SoundFX.click();
          const res = commands[cmd]();
          appendOutput(cmd, res);
        }
      });
    });

    terminalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const rawCmd = this.value.trim();
        const cmd = rawCmd.toLowerCase();
        this.value = '';

        if (!cmd) return;

        if (window.SoundFX) window.SoundFX.click();

        if (commands[cmd]) {
          const res = commands[cmd]();
          appendOutput(rawCmd, res);
        } else {
          appendOutput(rawCmd, `<span style="color:#ff5f56;">Command not recognized: '${escapeHtml(cmd)}'. Type '<span class="kw">help</span>' for available commands.</span>`);
        }
      }
    });
  });
})();
