export class ColorPickerControl {
  constructor(optionsOrFn) {
    if (typeof optionsOrFn === 'function') {
      this.onChange = optionsOrFn;
      this.initialColor = '#3bb2d0';
      this.initialOpacity = 0.2;
    } else {
      const {
        onChange,
        initialColor = '#3bb2d0',
        initialOpacity = 0.2,
      } = optionsOrFn || {};
      this.onChange = onChange;
      this.initialColor = initialColor;
      this.initialOpacity = initialOpacity;
    }
    this._map = null;
    this._container = null;
    this._isOpen = false;
    this._color = this.initialColor;
    this._opacity = this.initialOpacity;
  }

  onAdd(map) {
    this._map = map;

    // Wrapper
    const group = document.createElement('div');
    group.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    group.style.position = 'relative';

    // Main button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mapboxgl-ctrl-icon';
    btn.setAttribute('aria-label', 'Color & Opacity');
    btn.style.width = '30px';
    btn.style.height = '30px';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    // Color dot
    const dot = document.createElement('span');
    dot.style.width = '14px';
    dot.style.height = '14px';
    dot.style.borderRadius = '50%';
    dot.style.background = this._color;
    dot.style.opacity = this._opacity;
    dot.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.2) inset';
    btn.appendChild(dot);
    this._dot = dot;

    // Panel (opens to the LEFT)
    const panel = document.createElement('div');
    panel.style.position = 'absolute';
    panel.style.top = '0';
    panel.style.right = '100%'; // open left
    panel.style.marginRight = '8px';
    panel.style.display = 'none';
    panel.style.flexDirection = 'column';
    panel.style.gap = '8px';
    panel.style.padding = '8px';
    panel.style.background = '#fff';
    panel.style.border = '1px solid rgba(0,0,0,0.15)';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    panel.style.zIndex = '2';
    panel.style.width = '140px';

    // Color picker input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = this._color;
    colorInput.style.width = '100%';
    colorInput.addEventListener('input', (e) => {
      this._color = e.target.value;
      this._update();
    });

    // Opacity slider
    const opacityWrapper = document.createElement('div');
    opacityWrapper.style.display = 'flex';
    opacityWrapper.style.flexDirection = 'column';
    opacityWrapper.style.fontSize = '12px';
    opacityWrapper.style.gap = '4px';

    const opacityLabel = document.createElement('span');
    opacityLabel.textContent = `Opacity: ${Math.round(this._opacity * 100)}%`;

    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0.1';
    opacitySlider.max = '1';
    opacitySlider.step = '0.05';
    opacitySlider.value = this._opacity;
    opacitySlider.addEventListener('input', (e) => {
      this._opacity = parseFloat(e.target.value);
      opacityLabel.textContent = `Opacity: ${Math.round(this._opacity * 100)}%`;
      this._update();
    });

    opacityWrapper.appendChild(opacityLabel);
    opacityWrapper.appendChild(opacitySlider);

    // Add to panel
    panel.appendChild(colorInput);
    panel.appendChild(opacityWrapper);

    // Toggle panel
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._isOpen = !this._isOpen;
      panel.style.display = this._isOpen ? 'flex' : 'none';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!group.contains(e.target)) {
        this._isOpen = false;
        panel.style.display = 'none';
      }
    });

    group.appendChild(btn);
    group.appendChild(panel);

    this._container = group;
    return group;
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = null;
  }

  _update() {
    if (this._dot) {
      this._dot.style.background = this._color;
      this._dot.style.opacity = this._opacity;
    }
    if (typeof this.onChange === 'function') {
      this.onChange(this._color, this._opacity);
    }
  }
}

export default ColorPickerControl;
