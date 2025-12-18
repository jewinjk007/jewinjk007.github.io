(function () {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  const form = document.querySelector(
    "form[action='https://api.web3forms.com/submit']"
  );
  const status = document.getElementById("form-status");

  /* Header Scroll Shadow */
  if (header) {
    const onScroll = () =>
      header.classList.toggle("scrolled", window.scrollY > 2);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile Menu Toggle */
  if (toggle && nav && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );
      if (open) {
        const firstLink = nav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    // Close menu on nav link click
    nav.addEventListener("click", (e) => {
      if (
        e.target.tagName === "A" &&
        header.classList.contains("nav-open")
      ) {
        toggle.click();
      }
    });

    // Close menu on ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        toggle.click();
        toggle.focus();
      }
    });
  }

  /* Hero Typing Animation - Remove cursor after completion */
  setTimeout(() => {
    const heading = document.querySelector('.hero-text .heading');
    if (heading) {
      heading.classList.add('typed');
    }
  }, 4500);

  // Contact Form Handling with Web3Forms
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "";

        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite;">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
            Sending...
          `;
        }

        // Create status element if it doesn't exist
        let statusElement = status;
        if (!statusElement) {
          statusElement = document.createElement("div");
          statusElement.id = "form-status";
          statusElement.style.marginTop = "15px";
          statusElement.style.padding = "12px";
          statusElement.style.borderRadius = "8px";
          statusElement.style.fontSize = "14px";
          statusElement.style.lineHeight = "1.6";
          form.appendChild(statusElement);
        }

        statusElement.textContent = "📤 Sending your message...";
        statusElement.style.backgroundColor = "#d1ecf1";
        statusElement.style.color = "#0c5460";
        statusElement.style.border = "1px solid #bee5eb";
        statusElement.style.display = "block";

        // Get form data
        const formData = new FormData(form);

        // Convert FormData to JSON object
        const object = {};
        formData.forEach((value, key) => {
          object[key] = value;
        });
        const json = JSON.stringify(object);

        // Send to Web3Forms API
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: json,
        });

        const result = await response.json();

        if (result.success) {
          const userEmail = object.email || "your email";
          statusElement.innerHTML = `
            <div>
              <strong>Message sent successfully!</strong><br>
              Thank you for reaching out. I'll get back to you soon at ${userEmail}.
            </div>
          `;
          statusElement.style.backgroundColor = "#d4edda";
          statusElement.style.color = "#155724";
          statusElement.style.border = "1px solid #c3e6cb";

          // Reset form
          form.reset();

          // Scroll to status message smoothly
          statusElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });

          // Hide success message after 8 seconds
          setTimeout(() => {
            statusElement.style.display = "none";
          }, 8000);
        } else {
          // Error from server
          throw new Error(result.message || "Submission failed");
        }

        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      } catch (error) {
        console.error("Form submission error:", error);

        const submitBtn = form.querySelector('button[type="submit"]');
        const to = "jewinjinson43@gmail.com";

        let statusElement = status;
        if (!statusElement) {
          statusElement = document.createElement("div");
          statusElement.id = "form-status";
          statusElement.style.marginTop = "15px";
          statusElement.style.padding = "12px";
          statusElement.style.borderRadius = "8px";
          statusElement.style.fontSize = "14px";
          statusElement.style.lineHeight = "1.6";
          form.appendChild(statusElement);
        }

        statusElement.innerHTML = `
          <div>
            <strong>Failed to send message.</strong><br>
            Please try again or email me directly at: <strong>${to}</strong><br><br>
            <button onclick="copyEmailToClipboard('${to}')" style="padding: 8px 16px; background: #B0684E; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 500;">
              Copy Email
            </button>
          </div>
        `;
        statusElement.style.backgroundColor = "#f8d7da";
        statusElement.style.color = "#721c24";
        statusElement.style.border = "1px solid #f5c6cb";
        statusElement.style.display = "block";

        // Reset button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            originalBtnText ||
            `
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.999 16.2L9.8 19.6c.4 0 .6-.2.9-.4l2.2-2.1 4.6 3.4c.8.4 1.4.2 1.6-.7l3-14c.3-1.1-.4-1.6-1.2-1.3L2.8 9.7c-1 .4-1 1 .1 1.3l5.6 1.7 10.2-6.4c.5-.3.9 0 .5.3l-9.2 9.6z"/>
            </svg>
            Send Message
          `;
        }
      }
    });
  }

  // Helper function for copy button
  window.copyEmailToClipboard = function (email) {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          alert("Email address copied to clipboard!");
        })
        .catch(() => {
          prompt("Copy this email address:", email);
        });
    } else {
      // Fallback for older browsers
      prompt("Copy this email address:", email);
    }
  };

  // Add CSS for spinning animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
})();