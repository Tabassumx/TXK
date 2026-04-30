document.addEventListener("DOMContentLoaded", () => {
   


    const productsArray = window.products || [];
    let cart = JSON.parse(localStorage.getItem('tkhan_cart')) || [];

    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    
    const qvModal = document.getElementById('quick-view-modal');
    const qvBackdrop = document.getElementById('qv-backdrop');
    let currentSelectedProduct = null;
    let currentSelectedSize = 9;

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartToggle = document.getElementById('cart-toggle');
    const closeCartBtn = document.getElementById('close-cart');

    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutBackdrop = document.getElementById('checkout-backdrop');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if(entry.target.style.getPropertyValue('--delay')) {
                    entry.target.style.transitionDelay = entry.target.style.getPropertyValue('--delay');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });


   
    document.addEventListener('mousemove', (e) => {
        if(cursorDot) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        }
        if(cursor) {
            cursor.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 250, fill: "forwards", easing: "ease-out" });
        }
    });

    function bindCursor() {
        document.querySelectorAll('a, button, .clickable, .quick-view-btn, .product-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('product-card')) {
                   if(cursor) {
                       cursor.style.width = '80px'; cursor.style.height = '80px';
                       cursor.style.border = 'none'; cursor.style.mixBlendMode = 'normal';
                       cursor.textContent = 'VIEW';
                       cursor.style.display = 'flex'; cursor.style.alignItems = 'center'; cursor.style.justifyContent = 'center';
                       cursor.style.fontSize = '12px'; cursor.style.fontFamily = 'Outfit, sans-serif'; cursor.style.fontWeight = '600'; cursor.style.letterSpacing = '1px';
                       cursor.style.color = '#fff'; cursor.style.backgroundColor = '#1a1a1a';
                   }
                   if(cursorDot) cursorDot.style.display = 'none';
                } else if(el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.classList.contains('clickable-input')) {
                   if(cursor) {
                       cursor.style.width = '2px'; cursor.style.height = '30px'; cursor.style.borderRadius = '0';
                   }
                   if(cursorDot) cursorDot.style.display = 'none';
                } else {
                   if(cursor) {
                       cursor.style.width = '60px'; cursor.style.height = '60px';
                       cursor.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                   }
                   if(cursorDot) cursorDot.style.display = 'none';
                }
            });
            el.addEventListener('mouseleave', () => {
                if(cursor) {
                    cursor.style.width = '30px'; cursor.style.height = '30px';
                    cursor.style.backgroundColor = 'transparent';
                    cursor.style.border = '2px solid #fff'; cursor.style.borderRadius = '50%';
                    cursor.style.mixBlendMode = 'difference'; cursor.textContent = '';
                }
                if(cursorDot) cursorDot.style.display = 'block';
            });
        });
    }

    document.addEventListener('mouseleave', () => { if(cursor) cursor.style.opacity = '0'; if(cursorDot) cursorDot.style.opacity = '0';});
    document.addEventListener('mouseenter', () => { if(cursor) cursor.style.opacity = '1'; if(cursorDot) cursorDot.style.opacity = '1';});






    function bindQuickViewBtns() {
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const id = parseInt(btn.getAttribute('data-id'));
                const prod = productsArray.find(p => p.id === id);
                if(prod) {
                    currentSelectedProduct = prod;
                    document.getElementById('qv-img').src = prod.img;
                    document.getElementById('qv-img').className = `tint-${prod.tint}`;
                    document.getElementById('qv-title').textContent = prod.name;
                    document.getElementById('qv-price').textContent = `$${prod.price}`;
                    if(qvModal) qvModal.classList.add('open');
                    if(qvBackdrop) qvBackdrop.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }


    



    const grid = document.getElementById('product-grid');
    const sortSelect = document.getElementById('sort-select');

    function renderProductsGrid(prods) {
        if (!grid) return;
        grid.innerHTML = '';
        prods.forEach((prod, index) => {
            const delay = (index % 3) * 0.15;
            const cardHTML = `
                <div class="product-card reveal" style="--reveal-anim: productReveal; --delay: ${delay}s" data-id="${prod.id}">
                    <div class="product-image">
                        <img src="${prod.img}" alt="${prod.name}" class="tint-${prod.tint}">
                        <div class="overlay">
                            <button class="btn btn-secondary quick-view-btn clickable" data-id="${prod.id}">Quick View</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${prod.name}</h3>
                        <p class="price">$${prod.price}</p>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        });
        
        bindQuickViewBtns();
        bindCursor();
        
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
    }

    if (grid && productsArray.length > 0) {
        const isFeaturedOnly = grid.classList.contains('featured-grid');
        let displayProducts = isFeaturedOnly ? productsArray.filter(p => p.featured) : [...productsArray];
        renderProductsGrid(displayProducts);

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                let sorted = [...displayProducts];
                if(e.target.value === 'price-asc') {
                    sorted.sort((a,b) => a.price - b.price);
                } else if(e.target.value === 'price-desc') {
                    sorted.sort((a,b) => b.price - a.price);
                }
                renderProductsGrid(sorted);
            });
        }
    }


 
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        if(document.querySelector('.g-hero-title')) {
            const tl = gsap.timeline();
            tl.from(".g-hero-title .word", { y: 150, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.2 })
              .from(".g-fade-up", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=0.8")
              .from(".g-hero-img", { x: 100, rotate: 10, opacity: 0, scale: 0.8, duration: 1.5, ease: "power3.out" }, "-=1.2");
        }

        const heroImgWrap = document.querySelector('.g-hero-img-wrap');
        if (heroImgWrap) {
            document.addEventListener('mousemove', (e) => {
                const x = (window.innerWidth / 2 - e.clientX) / 40;
                const y = (window.innerHeight / 2 - e.clientY) / 40;
                gsap.to(".g-hero-img", { x: x + 10 + "%", y: y, rotate: -15, duration: 1, ease: "power2.out" });
            });
            gsap.to(".g-hero-img-wrap", {
                yPercent: 30, ease: "none",
                scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
            });
        }

        if (document.querySelector('.g-marquee')) {
            gsap.to(".marquee-content", {
                xPercent: -50, ease: "none",
                scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1 }
            });
        }

        if (document.querySelector('.gsap-pin-section')) {
            const tlPin = gsap.timeline({
                scrollTrigger: { trigger: ".gsap-pin-section", start: "top top", end: "+=100%", pin: true, scrub: 1 }
            });
            tlPin.from(".g-about-text", { opacity: 0, y: 50, stagger: 0.3 })
                 .from(".g-about-img", { x: 100, opacity: 0, scale: 0.9 }, "<");
        }
    }


    ['close-quick-view', 'qv-backdrop'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSelectedSize = parseInt(btn.textContent);
        });
    });
    
    if(cartToggle) cartToggle.addEventListener('click', openCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

    function openCart() {
        if(cartSidebar) cartSidebar.classList.add('open');
        if(cartBackdrop) cartBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
    
    function closeCart() {
        if(cartSidebar) cartSidebar.classList.remove('open');
        if(cartBackdrop) cartBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    const qvAddCart = document.getElementById('qv-add-cart');
    if(qvAddCart) {
        qvAddCart.addEventListener('click', () => {
            if(currentSelectedProduct) {
                cart.push({ ...currentSelectedProduct, size: currentSelectedSize, cartId: Date.now() });
                saveCart();
                updateCartCount();
                closeModals();
                setTimeout(openCart, 500); 
            }
        });
    }

    function saveCart() { localStorage.setItem('tkhan_cart', JSON.stringify(cart)); }
    function updateCartCount() {
        const cnt = document.getElementById('cart-count');
        if(cnt) cnt.textContent = cart.length;
    }

    function renderCart() {
        const container = document.getElementById('cart-items');
        if(!container) return;
        
        container.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p style="color:var(--text-light);text-align:center;margin-top:2rem;">Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                total += item.price;
                const html = `
                    <div class="cart-item">
                        <div class="cart-item-img"><img src="${item.img}" class="tint-${item.tint}"></div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>Size: ${item.size} &nbsp;|&nbsp; $${item.price}</p>
                            <span class="cart-item-remove clickable" data-cid="${item.cartId}">Remove</span>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', html);
            });
        }
        
        const priceTag = document.getElementById('cart-total-price');
        const checkTag = document.getElementById('checkout-total');
        if(priceTag) priceTag.textContent = `$${total}`;
        if(checkTag) checkTag.textContent = `$${total}`;
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cid = parseInt(e.target.getAttribute('data-cid'));
                cart = cart.filter(c => c.cartId !== cid);
                saveCart(); updateCartCount(); renderCart(); bindCursor(); 
            });
        });
        bindCursor();
    }


    const checkoutBtn = document.getElementById('checkout-btn');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                closeCart();
                if(checkoutModal) checkoutModal.classList.add('open');
                if(checkoutBackdrop) checkoutBackdrop.classList.add('open');
                document.body.style.overflow = 'hidden';
            } else {
                alert('Your cart is empty!');
            }
        });
    }





    const payTabs = document.querySelectorAll('.pay-tab');
    if(payTabs.length > 0) {
        payTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const methodId = tab.getAttribute('data-method');
                payTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(methodId).classList.add('active');
            });
        });
    }

    function closeModals() {
        if(qvModal) qvModal.classList.remove('open');
        if(qvBackdrop) qvBackdrop.classList.remove('open');
        if(checkoutModal) checkoutModal.classList.remove('open');
        if(checkoutBackdrop) checkoutBackdrop.classList.remove('open');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            const formContainer = document.getElementById('checkout-form-container');
            const successContainer = document.getElementById('order-success-container');
            if(formContainer) formContainer.style.display = 'block';
            if(successContainer) successContainer.style.display = 'none';
        }, 500);
    }

    ['close-checkout', 'checkout-backdrop'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('click', closeModals);
    });

    const form = document.getElementById('checkout-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
       
            const randomCode = Math.floor(Math.random() * 900000 + 100000); // 6 digits
            const orderId = `ORD-TXK-${randomCode}`;
            
           
            let total = 0;
            let billHtml = `<div style="border-bottom: 1px solid #eaeaea; margin-bottom: 1rem; padding-bottom: 0.5rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; font-size:0.8rem;">Order Summary</div>`;
            
            cart.forEach(item => {
                total += item.price;
                billHtml += `<div style="display:flex; justify-content:space-between; margin-bottom:0.8rem;">
                                <span>${item.name} <span style="color:var(--text-light); font-size:0.8rem;">(Sz: ${item.size})</span></span>
                                <span>$${item.price}</span>
                             </div>`;
            });
            
            billHtml += `<div style="border-top: 1px solid #eaeaea; margin-top: 1rem; padding-top: 1rem; font-weight:600; display:flex; justify-content:space-between;">
                            <span>Total Paid</span>
                            <span>$${total}</span>
                         </div>`;
                         
          
            const orderIdDisplay = document.getElementById('order-id-display');
            const billDetails = document.getElementById('order-bill-details');
            
            if (orderIdDisplay) orderIdDisplay.textContent = `Order Reference: #${orderId}`;
            if (billDetails) billDetails.innerHTML = billHtml;

         
            document.getElementById('checkout-form-container').style.display = 'none';
            document.getElementById('order-success-container').style.display = 'block';
            
          
            cart = [];
            saveCart();
            updateCartCount();
            renderCart();
        });
    }

    const continueBtn = document.getElementById('continue-shopping');
    if(continueBtn) {
        continueBtn.addEventListener('click', () => {
            closeModals();
            const collection = document.getElementById('collection');
            if(collection) window.scrollTo({ top: collection.offsetTop, behavior: 'smooth' });
        });
    }


    updateCartCount();
    bindCursor();
});
